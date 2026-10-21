import "server-only";
import { NextResponse } from "next/server";
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

    console.log(calculated);

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
        { error: "Failed to create payroll run", details: dbDetails(runError) },
        { status: 500 },
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
        })),
      )
      .select(
        "id, employee_id, basic_salary, housing_allowance, other_allowances, unpaid_leave_days, gosi_deduction, absence_deduction, other_deductions, attendance_deduction, net_salary",
      );

    if (itemsError || !insertedItems) {
      console.error("Payroll items insert failed:", itemsError);
      await supabase.from("payroll_runs").delete().eq("id", run.id).eq("organization_id", organizationId);
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
        await supabase.from("payroll_run_items").delete()
          .eq("payroll_run_id", run.id).eq("organization_id", organizationId);
        await supabase.from("payroll_runs").delete()
          .eq("id", run.id).eq("organization_id", organizationId);
        return NextResponse.json(
          { error: "Failed to apply attendance deductions. Please retry.", details: dbDetails(appError) },
          { status: appError.code === "23505" ? 409 : 500 },
        );
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
      }),
      { gosi_deduction: 0, absence_deduction: 0, net_salary: 0 },
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
        },
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