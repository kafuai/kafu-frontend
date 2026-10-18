import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-auth/server";
import { resolveWorkspaceIdentity } from "@/lib/workspace-identity/tenantResolver";
import { hasPermission } from "@/lib/rbac/authorization";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import {
  calculatePayrollItem,
  monthToPeriod,
  overlapDays,
  WAGE_DAYS_PER_MONTH,
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

type UnpaidLeaveRow = {
  user_id: string;
  request_data: { start_date?: string; end_date?: string } | null;
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

/**
 * Database error details. Only ever returned to an authenticated owner
 * (the owner check runs before any query). Remove once the feature is stable.
 */
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
 * employee in memory, bulk-inserts payroll_run_items, returns the grid data.
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

    // NOTE: swap for a dedicated payroll-runs permission if you have one.
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

    // A payroll run must never silently treat missing salary data as zero.
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

    // GOSI depends on nationality, so never guess it.
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

    /* ---------- unpaid leave days from APPROVED unpaid leave requests ---------- */
    const linkedUserIds = employees
      .map((e) => e.user_id)
      .filter((id): id is string => Boolean(id));

    const unpaidDaysByUser = new Map<string, number>();

    if (linkedUserIds.length > 0) {
      const { data: leaves, error: leavesError } = await supabase
        .from("employee_requests")
        .select("user_id, request_data")
        .eq("organization_id", organizationId)
        .eq("request_type", "leave")
        .eq("status", "approved")
        .eq("request_data->>leave_type", "unpaid")
        .in("user_id", linkedUserIds);

      if (leavesError) {
        console.error("Unpaid leave load failed:", leavesError);
        return NextResponse.json(
          { error: "Failed to load unpaid leave", details: dbDetails(leavesError) },
          { status: 500 },
        );
      }

      for (const leave of (leaves ?? []) as unknown as UnpaidLeaveRow[]) {
        const start = leave.request_data?.start_date?.slice(0, 10);
        const end = leave.request_data?.end_date?.slice(0, 10);
        if (!start || !end) continue;

        const days = overlapDays(start, end, period.start, period.end);
        if (days > 0) {
          unpaidDaysByUser.set(
            leave.user_id,
            (unpaidDaysByUser.get(leave.user_id) ?? 0) + days,
          );
        }
      }
    }

    /* ------------------------- calculation engine ------------------------- */
    const calculated = employees.map((employee) => {
      const unpaid = employee.user_id
        ? Math.min(unpaidDaysByUser.get(employee.user_id) ?? 0, WAGE_DAYS_PER_MONTH)
        : 0;

      const result = calculatePayrollItem({
        basic_salary: toNumber(employee.basic_salary),
        housing_allowance: toNumber(employee.housing_allowance),
        other_allowances: toNumber(employee.other_allowances),
        is_saudi: employee.is_saudi === true,
        unpaid_leave_days: unpaid,
      });

      return { employee, result };
    });

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

    /* --------------------- 5) bulk insert (single statement) --------------------- */
    const { data: insertedItems, error: itemsError } = await supabase
      .from("payroll_run_items")
      .insert(
        calculated.map(({ employee, result }) => ({
          organization_id: organizationId,
          payroll_run_id: run.id,
          employee_id: employee.id,
          employee_name: employee.full_name, // <--- أضف هذا السطر هنا
          employee_number: employee.employee_number, // يمكنك إضافة الرقم الوظيفي أيضاً إذا كان الجدول يطلبه
          ...result,
        })),
      )
      .select(
        "id, employee_id, basic_salary, housing_allowance, other_allowances, unpaid_leave_days, gosi_deduction, absence_deduction, other_deductions, net_salary",
      );

    if (itemsError || !insertedItems) {
      console.error("Payroll items insert failed:", itemsError);

      // One INSERT statement is atomic, so no items were saved.
      // Remove the empty run so no orphan draft remains.
      await supabase
        .from("payroll_runs")
        .delete()
        .eq("id", run.id)
        .eq("organization_id", organizationId);

      return NextResponse.json(
        { error: "Failed to create payroll items", details: dbDetails(itemsError) },
        { status: 500 },
      );
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