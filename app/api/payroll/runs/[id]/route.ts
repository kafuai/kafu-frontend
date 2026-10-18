import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-auth/server";
import { resolveWorkspaceIdentity } from "@/lib/workspace-identity/tenantResolver";
import { hasPermission } from "@/lib/rbac/authorization";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { calculatePayrollItem } from "@/src/enterprise/business/payroll/payrollCalculator";

type RouteContext = { params: Promise<{ id: string }> };
type JsonObject = Record<string, unknown>;

const isUuid = (value: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const isObject = (value: unknown): value is JsonObject =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// Keep monetary values non-negative, finite, and limited to two decimal places.
const isValidMoney = (value: unknown): value is number =>
  typeof value === "number" &&
  Number.isFinite(value) &&
  value >= 0 &&
  value <= 1_000_000_000 &&
  Math.abs(value * 100 - Math.round(value * 100)) < 1e-7;

/** GET /api/payroll/runs/:id -> the run + its items (for the review grid). */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!isUuid(id)) {
      return NextResponse.json({ error: "Invalid run ID" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const identity = await resolveWorkspaceIdentity(supabase);

    if (!identity?.organizationId) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 403 });
    }

    if (!hasPermission(identity.role, PERMISSIONS.PAYROLL_VIEW)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: run, error: runError } = await supabase
      .from("payroll_runs")
      .select("id, organization_id, period_start, period_end, status")
      .eq("id", id)
      .eq("organization_id", identity.organizationId)
      .maybeSingle();

    if (runError) {
      return NextResponse.json({ error: "Failed to load payroll run" }, { status: 500 });
    }

    if (!run) {
      return NextResponse.json({ error: "Payroll run not found" }, { status: 404 });
    }

    const { data: items, error: itemsError } = await supabase
      .from("payroll_run_items")
      .select(
        "id, employee_id, basic_salary, housing_allowance, other_allowances, unpaid_leave_days, gosi_deduction, absence_deduction, other_deductions, net_salary",
      )
      .eq("payroll_run_id", id)
      .eq("organization_id", identity.organizationId);

    if (itemsError) {
      return NextResponse.json({ error: "Failed to load payroll items" }, { status: 500 });
    }

    const employeeIds = Array.from(new Set((items ?? []).map((i) => i.employee_id as string)));
    const employeeById = new Map<
      string,
      { employee_number: string; full_name: string; is_saudi: boolean | null }
    >();

    if (employeeIds.length > 0) {
      const { data: employees, error: employeesError } = await supabase
        .from("payroll_employees")
        .select("id, employee_number, full_name, is_saudi")
        .eq("organization_id", identity.organizationId)
        .in("id", employeeIds);

      if (employeesError) {
        return NextResponse.json({ error: "Failed to load employees" }, { status: 500 });
      }

      for (const e of employees ?? []) {
        employeeById.set(e.id, {
          employee_number: e.employee_number,
          full_name: e.full_name,
          is_saudi: e.is_saudi,
        });
      }
    }

    return NextResponse.json({
      run,
      items: (items ?? []).map((item) => ({
        ...item,
        ...(employeeById.get(item.employee_id as string) ?? {}),
      })),
    });
  } catch (error) {
    console.error("Payroll run load failed:", error);
    return NextResponse.json({ error: "Failed to load payroll run" }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!isUuid(id)) {
      return NextResponse.json({ error: "Invalid run ID" }, { status: 400 });
    }

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

    const body: unknown = await request.json().catch(() => null);
    if (!isObject(body)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Approval is a separate privilege from editing a draft payroll run.
    if (body.status === "approved") {
      if (!hasPermission(identity.role, PERMISSIONS.PAYROLL_RUNS_APPROVE)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      // Conditional update prevents approving a run that is no longer a draft.
      const { data, error } = await supabase
        .from("payroll_runs")
        .update({ status: "approved" })
        .eq("id", id)
        .eq("organization_id", identity.organizationId)
        .eq("status", "draft")
        .select("id, organization_id, period_start, period_end, status")
        .maybeSingle();

      if (error) {
        console.error("Payroll run approval failed:", error);
        return NextResponse.json({ error: "Failed to approve payroll run" }, { status: 500 });
      }

      if (!data) {
        return NextResponse.json(
          { error: "Payroll run not found or is no longer a draft." },
          { status: 409 },
        );
      }

      return NextResponse.json({ success: true, run: data });
    }

    if (body.action !== "update_item") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (!hasPermission(identity.role, PERMISSIONS.PAYROLL_RUNS_MANAGE)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (typeof body.itemId !== "string" || !isUuid(body.itemId) || !isObject(body.data)) {
      return NextResponse.json({ error: "Invalid payroll item data" }, { status: 400 });
    }

    const otherAllowances = body.data.other_allowances;
    const otherDeductions = body.data.other_deductions;
    const unpaidLeaveDays = body.data.unpaid_leave_days;

    if (!isValidMoney(otherAllowances) || !isValidMoney(otherDeductions)) {
      return NextResponse.json(
        { error: "Allowances and deductions must be valid non-negative amounts with up to two decimals." },
        { status: 400 },
      );
    }

    if (
      typeof unpaidLeaveDays !== "number" ||
      !Number.isInteger(unpaidLeaveDays) ||
      unpaidLeaveDays < 0 ||
      unpaidLeaveDays > 30
    ) {
      return NextResponse.json(
        { error: "Unpaid leave days must be a whole number between 0 and 30." },
        { status: 400 },
      );
    }

    // Confirm the run belongs to this organization and is still editable.
    const { data: run, error: runError } = await supabase
      .from("payroll_runs")
      .select("id, status")
      .eq("id", id)
      .eq("organization_id", identity.organizationId)
      .maybeSingle();

    if (runError) {
      console.error("Payroll run validation failed:", runError);
      return NextResponse.json({ error: "Failed to validate payroll run" }, { status: 500 });
    }

    if (!run) {
      return NextResponse.json({ error: "Payroll run not found" }, { status: 404 });
    }

    if (run.status !== "draft") {
      return NextResponse.json({ error: "Only draft payroll runs can be edited." }, { status: 409 });
    }

    // Fetch the item using both run and tenant IDs; never trust a client-supplied employee ID.
    const { data: existingItem, error: itemError } = await supabase
      .from("payroll_run_items")
      .select("id, employee_id, basic_salary, housing_allowance")
      .eq("id", body.itemId)
      .eq("payroll_run_id", id)
      .eq("organization_id", identity.organizationId)
      .maybeSingle();

    if (itemError) {
      console.error("Payroll item validation failed:", itemError);
      return NextResponse.json({ error: "Failed to validate payroll item" }, { status: 500 });
    }

    if (!existingItem) {
      return NextResponse.json({ error: "Item not found or unauthorized" }, { status: 404 });
    }

    // Nationality is stored on the employee record and controls the GOSI calculation.
    const { data: employee, error: employeeError } = await supabase
      .from("payroll_employees")
      .select("id, is_saudi")
      .eq("id", existingItem.employee_id)
      .eq("organization_id", identity.organizationId)
      .maybeSingle();

    if (employeeError) {
      console.error("Payroll employee lookup failed:", employeeError);
      return NextResponse.json({ error: "Failed to load employee payroll data" }, { status: 500 });
    }

    if (!employee || typeof employee.is_saudi !== "boolean") {
      return NextResponse.json(
        { error: "Employee nationality is missing; payroll item cannot be recalculated." },
        { status: 422 },
      );
    }

    const basicSalary = Number(existingItem.basic_salary);
    const housingAllowance = Number(existingItem.housing_allowance);
    if (!isValidMoney(basicSalary) || !isValidMoney(housingAllowance)) {
      return NextResponse.json(
        { error: "Stored salary data is invalid; correct the employee salary data before editing this run." },
        { status: 422 },
      );
    }

    // Recalculate all derived fields on the server; ignore client-supplied net/absence/GOSI values.
    const calculated = calculatePayrollItem({
      basic_salary: basicSalary,
      housing_allowance: housingAllowance,
      other_allowances: otherAllowances,
      other_deductions: otherDeductions,
      unpaid_leave_days: unpaidLeaveDays,
      is_saudi: employee.is_saudi,
    });

    const { data, error } = await supabase
      .from("payroll_run_items")
      .update({
        other_allowances: calculated.other_allowances,
        other_deductions: calculated.other_deductions,
        unpaid_leave_days: calculated.unpaid_leave_days,
        gosi_deduction: calculated.gosi_deduction,
        absence_deduction: calculated.absence_deduction,
        net_salary: calculated.net_salary,
      })
      .eq("id", body.itemId)
      .eq("payroll_run_id", id)
      .eq("organization_id", identity.organizationId)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Payroll item update failed:", error);
      return NextResponse.json({ error: "Failed to update payroll item" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Payroll item could not be updated." }, { status: 409 });
    }

    return NextResponse.json({ success: true, item: data });
  } catch (error) {
    console.error("Patch run error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
