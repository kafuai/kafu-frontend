import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";
import { createSupabaseServerClient } from "@/lib/supabase-auth/server";
import { resolveWorkspaceIdentity } from "@/lib/workspace-identity/tenantResolver";
import { hasPermission } from "@/lib/rbac/authorization";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import {
  calculatePayrollItem,
  monthToPeriod,
} from "@/src/enterprise/business/payroll/payrollCalculator";

type EmployeeRow = {
  id: string;
  user_id: string | null;
  employee_number: string;
  full_name: string;
  basic_salary: number | string | null;
  housing_allowance: number | string | null;
  other_allowances: number | string | null;
  is_saudi: boolean | null;
};

type DbError = {
  message?: string;
  code?: string;
  hint?: string | null;
  details?: string | null;
};

const toNumber = (value: unknown): number => {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
};

const dbDetails = (error: DbError | null | undefined) =>
  error
    ? {
        message: error.message ?? null,
        code: error.code ?? null,
        hint: error.hint ?? null,
        details: error.details ?? null,
      }
    : null;

async function isOwner(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
  organizationId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("organization_memberships")
    .select("role")
    .eq("organization_id", organizationId)
    .eq("user_id", userId)
    .maybeSingle();
  return !error && data?.role === "owner";
}

/**
 * POST /api/payroll/runs
 * Body: { "month": "2026-10" }
 *
 * Creates a DRAFT payroll run for the month, calculates every active
 * employee in memory (defaults unpaid leave to 0), bulk-inserts items.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const identity = await resolveWorkspaceIdentity(supabase);
    if (!identity?.organizationId) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 403 });
    }

    const organizationId = identity.organizationId;

    if (
      !(await isOwner(supabase, user.id, organizationId)) ||
      !hasPermission(identity.role, PERMISSIONS.PAYROLL_EMPLOYEES_MANAGE)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    const period = monthToPeriod(body?.month);

    if (!period) {
      return NextResponse.json(
        { error: 'Invalid month. Expected format "YYYY-MM".' },
        { status: 400 },
      );
    }

    /* ---------------- no duplicate run for the same period ---------------- */
    const { data: existingRun, error: existingError } = await supabase
      .from("payroll_runs")
      .select("id")
      .eq("organization_id", organizationId)
      .eq("period_start", period.start)
      .eq("period_end", period.end)
      .limit(1);

    if (existingError) {
      console.error("Payroll run duplicate check failed:", existingError);
      return NextResponse.json(
        { error: "Failed to check existing payroll runs", details: dbDetails(existingError) },
        { status: 500 },
      );
    }

    if (existingRun && existingRun.length > 0) {
      return NextResponse.json(
        {
          error: "A payroll run already exists for this period.",
          runId: existingRun[0].id,
        },
        { status: 409 },
      );
    }

    /* ----------------------- fetch active employees ----------------------- */
    const { data: employeesData, error: employeesError } = await supabase
      .from("payroll_employees")
      .select(
        "id, user_id, employee_number, full_name, basic_salary, housing_allowance, other_allowances, is_saudi",
      )
      .eq("organization_id", organizationId)
      .eq("status", "active")
      .order("employee_number", { ascending: true });

    if (employeesError) {
      console.error("Payroll employees load failed:", employeesError);
      return NextResponse.json(
        { error: "Failed to load employees", details: dbDetails(employeesError) },
        { status: 500 },
      );
    }

    const employees = (employeesData ?? []) as unknown as EmployeeRow[];

    if (employees.length === 0) {
      return NextResponse.json(
        { error: "There are no active employees to include in the payroll run." },
        { status: 422 },
      );
    }

    const missingSalary = employees.filter(
      (e) =>
        e.basic_salary == null ||
        e.housing_allowance == null ||
        e.other_allowances == null,
    );
    if (missingSalary.length > 0) {
      return NextResponse.json(
        {
          error: "Some active employees have incomplete salary data.",
          employees: missingSalary.map((e) => ({
            id: e.id,
            employee_number: e.employee_number,
            full_name: e.full_name,
          })),
        },
        { status: 422 },
      );
    }

    const unknownNationality = employees.filter(
      (e) => typeof e.is_saudi !== "boolean",
    );
    if (unknownNationality.length > 0) {
      return NextResponse.json(
        {
          error: "Some employees have no nationality (is_saudi) set.",
          employees: unknownNationality.map((e) => ({
            id: e.id,
            employee_number: e.employee_number,
            full_name: e.full_name,
          })),
        },
        { status: 422 },
      );
    }


    /* ------------------------- calculation engine ------------------------- */
        /* ------------- خصومات الحضور المعتمدة وغير المدرجة سابقًا ------------- */
    const { data: approvedRaw, error: approvedError } = await supabase
      .from("attendance_deduction_proposals")
      .select("id, user_id, payroll_employee_id, final_amount")
      .eq("organization_id", organizationId)
      .in("status", ["approved", "apply_failed"])
      .not("final_amount", "is", null)
      .gt("final_amount", 0)
      .lte("incident_date", period.end);

    if (approvedError) {
      console.error("Attendance deductions load failed:", approvedError);
      return NextResponse.json({ error: "Failed to load attendance deductions" }, { status: 500 });
    }

    // apply_failed تُعاد محاولتها فقط إذا كانت معتمدة (لها final_amount وقرار)، ولم تُدرج
    const approvedIds = (approvedRaw ?? []).map((p) => p.id as string);
    const alreadyApplied = new Set<string>();
    if (approvedIds.length > 0) {
      const { data: apps } = await supabase
        .from("attendance_deduction_applications")
        .select("proposal_id")
        .eq("organization_id", organizationId)
        .in("proposal_id", approvedIds);
      for (const a of apps ?? []) alreadyApplied.add(a.proposal_id as string);
    }

    const employeeByUser = new Map(
      employees.filter((e) => e.user_id).map((e) => [e.user_id as string, e]),
    );
    const employeeIdSet = new Set(employees.map((e) => e.id));

    // employeeId -> { total, proposals[] }
    const attendanceByEmployee = new Map<string, { total: number; proposals: { id: string; amount: number }[] }>();
    const orphanProposalIds: string[] = [];

    for (const p of approvedRaw ?? []) {
      if (alreadyApplied.has(p.id as string)) continue;
      const empId =
        (p.payroll_employee_id && employeeIdSet.has(p.payroll_employee_id as string)
          ? (p.payroll_employee_id as string)
          : employeeByUser.get(p.user_id as string)?.id) ?? null;

      if (!empId) { orphanProposalIds.push(p.id as string); continue; }

      const entry = attendanceByEmployee.get(empId) ?? { total: 0, proposals: [] };
      const amount = toNumber(p.final_amount);
      entry.total = Math.round((entry.total + amount) * 100) / 100;
      entry.proposals.push({ id: p.id as string, amount });
      attendanceByEmployee.set(empId, entry);
    }

    /* ------------------------- calculation engine ------------------------- */
    const failedProposalIds: string[] = [...orphanProposalIds];

    const calculated = employees.map((employee) => {
      const att = attendanceByEmployee.get(employee.id);

      const base = {
        basic_salary: toNumber(employee.basic_salary),
        housing_allowance: toNumber(employee.housing_allowance),
        other_allowances: toNumber(employee.other_allowances),
        is_saudi: employee.is_saudi === true,
        unpaid_leave_days: 0,
      };

      let result = calculatePayrollItem({ ...base, attendance_deduction: att?.total ?? 0 });
      let appliedProposals = att?.proposals ?? [];

      // الصافي لا يمكن أن يكون سالبًا (قيد في قاعدة البيانات): لا نقص المبلغ بصمت
      if (att && result.net_salary < 0) {
        failedProposalIds.push(...att.proposals.map((p) => p.id));
        appliedProposals = [];
        result = calculatePayrollItem({ ...base, attendance_deduction: 0 });
      }

      return { employee, result, appliedProposals };
    });

    // Read Owner-managed holiday assignments and actual attendance through the
    // server-only admin client. The employee-facing attendance APIs never return
    // these settings.
    const admin = createSupabaseAdminClient();
    const { data: holidayPeriods, error: holidayPeriodsError } = await admin
      .from("organization_holiday_periods")
      .select("id,start_date,end_date")
      .eq("organization_id", organizationId)
      .lte("start_date", period.end)
      .gte("end_date", period.start);
    if (holidayPeriodsError) throw new Error(holidayPeriodsError.message);

    const holidayPeriodIds = (holidayPeriods ?? []).map((h) => h.id as string);
    const holidayPeriodById = new Map((holidayPeriods ?? []).map((h) => [h.id as string, h]));
    const { data: holidayAssignments, error: holidayAssignmentsError } = holidayPeriodIds.length
      ? await admin.from("organization_holiday_assignments")
          .select("id,holiday_period_id,user_id,overtime_calculation_type,overtime_percentage,overtime_fixed_daily_amount")
          .eq("organization_id", organizationId).eq("overtime_enabled", true)
          .in("holiday_period_id", holidayPeriodIds)
      : { data: [] as { id: string; holiday_period_id: string; user_id: string; overtime_calculation_type: "percentage" | "fixed_daily"; overtime_percentage: number | string; overtime_fixed_daily_amount: number | string }[], error: null };
    if (holidayAssignmentsError) throw new Error(holidayAssignmentsError.message);

    type OvertimeApplicationDraft = {
      assignmentId: string; employeeId: string; hours: number; eligibleDays: number;
      calculationType: "percentage" | "fixed_daily"; percentage: number;
      dailyBasicSalary: number; extraPerDay: number; amount: number;
    };
    const overtimeDrafts: OvertimeApplicationDraft[] = [];
    const overtimeTotals = new Map<string, { hours: number; days: number; amount: number }>();
    const eligibleAssignments = (holidayAssignments ?? []).filter((a) => employeeByUser.has(a.user_id as string));
    const holidayUserIds = [...new Set(eligibleAssignments.map((a) => a.user_id as string))];

    if (eligibleAssignments.length > 0) {
      const { data: events, error: eventsError } = await admin.from("attendance_events")
        .select("user_id,work_date,assignment_id,shift_id,event_type,occurred_at")
        .eq("organization_id", organizationId)
        .gte("work_date", period.start).lte("work_date", period.end)
        .in("user_id", holidayUserIds)
        .order("occurred_at", { ascending: true });
      if (eventsError) throw new Error(eventsError.message);

      type AttendanceEvent = { user_id: string; work_date: string; assignment_id: string | null; shift_id: string | null; event_type: string; occurred_at: string };
      const groups = new Map<string, AttendanceEvent[]>();
      for (const rawEvent of events ?? []) {
        const event = rawEvent as AttendanceEvent;
        const key = `${event.user_id}|${event.work_date}|${event.assignment_id ?? ""}|${event.shift_id ?? ""}`;
        const group = groups.get(key) ?? [];
        group.push(event);
        groups.set(key, group);
      }
      const completeHoursByUserDate = new Map<string, number>();
      for (const group of groups.values()) {
        const checkIns = group.filter((e) => e.event_type === "check_in");
        const checkOuts = group.filter((e) => e.event_type === "check_out");
        for (const checkIn of checkIns) {
          const checkInMs = Date.parse(checkIn.occurred_at);
          const checkOut = checkOuts.find((e) => Date.parse(e.occurred_at) > checkInMs);
          if (!checkOut) continue;
          const hours = (Date.parse(checkOut.occurred_at) - checkInMs) / 3_600_000;
          if (!Number.isFinite(hours) || hours <= 0 || hours > 24) continue;
          const key = `${checkIn.user_id}|${checkIn.work_date}`;
          completeHoursByUserDate.set(key, (completeHoursByUserDate.get(key) ?? 0) + hours);
          break; // one complete pair per scheduled assignment/shift/date group
        }
      }

      for (const assignment of eligibleAssignments) {
        const employee = employeeByUser.get(assignment.user_id as string);
        const holiday = holidayPeriodById.get(assignment.holiday_period_id as string);
        if (!employee || !holiday) continue;
        let hours = 0;
        let eligibleDays = 0;
        const from = holiday.start_date > period.start ? holiday.start_date : period.start;
        const to = holiday.end_date < period.end ? holiday.end_date : period.end;
        const cursor = new Date(`${from}T00:00:00.000Z`);
        const last = new Date(`${to}T00:00:00.000Z`);
        while (cursor <= last) {
          const date = cursor.toISOString().slice(0, 10);
          const dayHours = completeHoursByUserDate.get(`${assignment.user_id}|${date}`) ?? 0;
          if (dayHours > 0) {
            hours += dayHours;
            eligibleDays += 1; // one eligible day per date; lateness deduction is separate
          }
          cursor.setUTCDate(cursor.getUTCDate() + 1);
        }
        hours = Math.round(hours * 100) / 100;
        if (eligibleDays <= 0) continue;
        const calculationType = assignment.overtime_calculation_type === "fixed_daily" ? "fixed_daily" : "percentage";
        const dailyBasicSalary = Math.round((toNumber(employee.basic_salary) / 30 + Number.EPSILON) * 100) / 100;
        const percentage = calculationType === "percentage" ? toNumber(assignment.overtime_percentage) : 0;
        const extraPerDay = calculationType === "percentage"
          ? dailyBasicSalary * percentage / 100
          : toNumber(assignment.overtime_fixed_daily_amount);
        const amount = Math.round((extraPerDay * eligibleDays + Number.EPSILON) * 100) / 100;
        if (!Number.isFinite(amount) || amount <= 0) continue;
        overtimeDrafts.push({ assignmentId: assignment.id as string, employeeId: employee.id, hours, eligibleDays, calculationType, percentage, dailyBasicSalary, extraPerDay, amount });
        const total = overtimeTotals.get(employee.id) ?? { hours: 0, days: 0, amount: 0 };
        total.hours = Math.round((total.hours + hours) * 100) / 100;
        total.days += eligibleDays;
        total.amount = Math.round((total.amount + amount) * 100) / 100;
        overtimeTotals.set(employee.id, total);
      }
    }

    /* --------------------------- 1) create the run --------------------------- */
    const { data: run, error: runError } = await supabase
      .from("payroll_runs")
      .insert({
        organization_id: organizationId,
        period_start: period.start,
        period_end: period.end,
        status: "draft",
      })
      .select("id, organization_id, period_start, period_end, status")
      .single();

    if (runError || !run) {
      console.error("Payroll run create failed:", runError);
      return NextResponse.json(
        { error: runError?.code === "23505" ? "A payroll run already exists for this period." : "Failed to create payroll run", details: dbDetails(runError) },
        { status: runError?.code === "23505" ? 409 : 500 },
      );
    }

    /* --------------------- 2) bulk insert items --------------------- */
    const { data: insertedItems, error: itemsError } = await supabase
      .from("payroll_run_items")
      .insert(
        calculated.map(({ employee, result }) => ({
          organization_id: organizationId,
          payroll_run_id: run.id,
          employee_id: employee.id,
          employee_name: employee.full_name,
          ...result,
          holiday_overtime_hours: overtimeTotals.get(employee.id)?.hours ?? 0,
          holiday_overtime_days: overtimeTotals.get(employee.id)?.days ?? 0,
          holiday_overtime_amount: overtimeTotals.get(employee.id)?.amount ?? 0,
          net_salary: Math.round((result.net_salary + (overtimeTotals.get(employee.id)?.amount ?? 0) + Number.EPSILON) * 100) / 100,
        })),
      )
      .select(
        "id, employee_id, basic_salary, housing_allowance, other_allowances, unpaid_leave_days, gosi_deduction, absence_deduction, other_deductions, attendance_deduction, holiday_overtime_hours, holiday_overtime_days, holiday_overtime_amount, net_salary",
      );

    if (itemsError || !insertedItems) {
      console.error("Payroll items insert failed:", itemsError);
      await admin.rpc("delete_draft_payroll_run", { p_organization_id: organizationId, p_payroll_run_id: run.id });
      return NextResponse.json(
        { error: "Failed to create payroll items", details: dbDetails(itemsError) },
        { status: 500 },
      );
    }

    /* ----- 3) ربط الخصومات بالعناصر (proposal_id UNIQUE يمنع التكرار) ----- */
    const itemByEmployee = new Map(insertedItems.map((i) => [i.employee_id as string, i.id as string]));
    const applications = calculated.flatMap(({ employee, appliedProposals }) =>
      appliedProposals.map((p) => ({
        organization_id: organizationId,
        proposal_id: p.id,
        payroll_run_id: run.id,
        payroll_run_item_id: itemByEmployee.get(employee.id) as string,
        amount: p.amount,
        created_by: user.id,
      })),
    );

    if (applications.length > 0) {
      const { error: appError } = await supabase
        .from("attendance_deduction_applications")
        .insert(applications);

      if (appError) {
        console.error("Attendance deduction apply failed:", appError);
        // تراجع كامل: items (يحذف أي applications بالـ CASCADE) ثم المسير
        await admin.rpc("delete_draft_payroll_run", { p_organization_id: organizationId, p_payroll_run_id: run.id });
        return NextResponse.json(
          { error: "Failed to apply attendance deductions. Please retry.", details: dbDetails(appError) },
          { status: appError.code === "23505" ? 409 : 500 },
        );
      }
    }

    // Persist each holiday assignment once per payroll run. Any failure rolls
    // back the draft run and its items, so no partial overtime is left applied.
    const holidayApplications = overtimeDrafts.map((draft) => ({
      organization_id: organizationId,
      holiday_assignment_id: draft.assignmentId,
      payroll_run_id: run.id,
      payroll_run_item_id: itemByEmployee.get(draft.employeeId) as string,
      hours: draft.hours,
      eligible_days: draft.eligibleDays,
      calculation_type: draft.calculationType,
      percentage: draft.percentage,
      hourly_basic_rate: 0,
      daily_basic_salary: draft.dailyBasicSalary,
      extra_per_day: draft.extraPerDay,
      amount: draft.amount,
      created_by: user.id,
    }));
    if (holidayApplications.length > 0) {
      const { error: holidayApplicationError } = await admin
        .from("holiday_overtime_applications").insert(holidayApplications);
      if (holidayApplicationError) {
        console.error("Holiday overtime application failed:", holidayApplicationError);
        await admin.rpc("delete_draft_payroll_run", { p_organization_id: organizationId, p_payroll_run_id: run.id });
        return NextResponse.json({ error: "Failed to apply holiday overtime. The draft payroll run was rolled back." }, { status: holidayApplicationError.code === "23505" ? 409 : 500 });
      }
    }

    if (failedProposalIds.length > 0) {
      await supabase
        .from("attendance_deduction_proposals")
        .update({ status: "apply_failed", updated_at: new Date().toISOString() })
        .in("id", failedProposalIds)
        .eq("organization_id", organizationId)
        .eq("status", "approved");
    }

    /* ------------------------------ 6) response ------------------------------ */
    const employeeById = new Map(employees.map((e) => [e.id, e]));

    const items = insertedItems.map((item) => {
      const employee = employeeById.get(item.employee_id as string);
      return {
        ...item,
        employee_number: employee?.employee_number ?? null,
        full_name: employee?.full_name ?? null,
        is_saudi: employee?.is_saudi ?? null,
      };
    });

    const totals = items.reduce(
      (acc, item) => ({
        gosi_deduction: acc.gosi_deduction + toNumber(item.gosi_deduction),
        absence_deduction: acc.absence_deduction + toNumber(item.absence_deduction),
        net_salary: acc.net_salary + toNumber(item.net_salary),
        holiday_overtime_amount: acc.holiday_overtime_amount + toNumber(item.holiday_overtime_amount),
        holiday_overtime_days: acc.holiday_overtime_days + toNumber(item.holiday_overtime_days),
      }),
      { gosi_deduction: 0, absence_deduction: 0, net_salary: 0, holiday_overtime_amount: 0, holiday_overtime_days: 0 },
    );

    return NextResponse.json(
      {
        message: "Draft payroll run is ready for review.",
        run,
        items,
        totals: {
          employees: items.length,
          gosi_deduction: Math.round(totals.gosi_deduction * 100) / 100,
          absence_deduction: Math.round(totals.absence_deduction * 100) / 100,
          net_salary: Math.round(totals.net_salary * 100) / 100,
          holiday_overtime_amount: Math.round(totals.holiday_overtime_amount * 100) / 100,
        },
        holidayOvertime: { applications: holidayApplications.length },
        attendance: {
          applied: applications.length,
          failed: failedProposalIds.length,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Payroll run creation failed:", error);
    return NextResponse.json(
      {
        error: "Failed to create payroll run",
        details: { message: error instanceof Error ? error.message : String(error) },
      },
      { status: 500 },
    );
  }
}