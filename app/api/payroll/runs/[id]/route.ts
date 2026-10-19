import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-auth/server";
import { resolveWorkspaceIdentity } from "@/lib/workspace-identity/tenantResolver";
import { hasPermission } from "@/lib/rbac/authorization";
import { PERMISSIONS } from "@/lib/rbac/permissions";

type RouteContext = { params: Promise<{ id: string }> };

const isUuid = (value: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

/** GET /api/payroll/runs/:id */
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

    if (runError) return NextResponse.json({ error: "Failed to load payroll run" }, { status: 500 });
    if (!run) return NextResponse.json({ error: "Payroll run not found" }, { status: 404 });

    const { data: items, error: itemsError } = await supabase
      .from("payroll_run_items")
      .select(
        "id, employee_id, basic_salary, housing_allowance, other_allowances, unpaid_leave_days, gosi_deduction, absence_deduction, other_deductions, net_salary",
      )
      .eq("payroll_run_id", id)
      .eq("organization_id", identity.organizationId);

    if (itemsError) return NextResponse.json({ error: "Failed to load payroll items" }, { status: 500 });

    const employeeIds = Array.from(new Set((items ?? []).map((i) => i.employee_id as string)));
    const employeeById = new Map<
      string,
      { employee_number: string; full_name: string; is_saudi: boolean | null; national_id: string | null; iban: string | null }
    >();

    if (employeeIds.length > 0) {
      const { data: employees, error: employeesError } = await supabase
        .from("payroll_employees")
        .select("id, employee_number, full_name, is_saudi, national_id, iban")
        .eq("organization_id", identity.organizationId)
        .in("id", employeeIds);

      if (employeesError) return NextResponse.json({ error: "Failed to load employees" }, { status: 500 });

      for (const e of employees ?? []) {
        employeeById.set(e.id, {
          employee_number: e.employee_number,
          full_name: e.full_name,
          is_saudi: e.is_saudi,
          national_id: e.national_id,
          iban: e.iban,
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
    return NextResponse.json({ error: "Failed to load payroll run" }, { status: 500 });
  }
}

/** PATCH /api/payroll/runs/:id -> Approve or Edit Items */
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!isUuid(id)) return NextResponse.json({ error: "Invalid run ID" }, { status: 400 });

    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const identity = await resolveWorkspaceIdentity(supabase);
    if (!identity?.organizationId) return NextResponse.json({ error: "Workspace not found" }, { status: 403 });

    if (!hasPermission(identity.role, PERMISSIONS.PAYROLL_EMPLOYEES_MANAGE)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    
    if (body.status === "approved") {
      const { data, error } = await supabase
        .from("payroll_runs")
        .update({ status: "approved" })
        .eq("id", id)
        .eq("organization_id", identity.organizationId)
        .eq("status", "draft")
        .select()
        .maybeSingle();

      if (error || !data) return NextResponse.json({ error: "Failed to approve run. It might already be approved." }, { status: 400 });
      return NextResponse.json({ success: true, run: data });
    }

    if (body.action === "update_item" && body.itemId && body.data) {
      const { data: existingItem } = await supabase
        .from("payroll_run_items")
        .select("id")
        .eq("id", body.itemId)
        .eq("payroll_run_id", id)
        .eq("organization_id", identity.organizationId)
        .maybeSingle();

      if (!existingItem) return NextResponse.json({ error: "Item not found or unauthorized" }, { status: 404 });

      const { data, error } = await supabase
        .from("payroll_run_items")
        .update({
          other_allowances: body.data.other_allowances,
          other_deductions: body.data.other_deductions,
          unpaid_leave_days: body.data.unpaid_leave_days,
          absence_deduction: body.data.absence_deduction,
          net_salary: body.data.net_salary,
        })
        .eq("id", body.itemId)
        .select()
        .single();

      if (error || !data) return NextResponse.json({ error: "Failed to update item." }, { status: 500 });
      return NextResponse.json({ success: true, item: data });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/** DELETE /api/payroll/runs/:id -> Delete a draft run to recreate it */
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!isUuid(id)) return NextResponse.json({ error: "Invalid run ID" }, { status: 400 });

    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const identity = await resolveWorkspaceIdentity(supabase);
    if (!identity?.organizationId) return NextResponse.json({ error: "Workspace not found" }, { status: 403 });

    if (!hasPermission(identity.role, PERMISSIONS.PAYROLL_EMPLOYEES_MANAGE)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // التأكد من أن المسير مسودة قبل حذفه
    const { data: run } = await supabase
      .from("payroll_runs")
      .select("status")
      .eq("id", id)
      .eq("organization_id", identity.organizationId)
      .maybeSingle();

    if (!run) return NextResponse.json({ error: "Run not found" }, { status: 404 });
    if (run.status !== "draft") return NextResponse.json({ error: "Cannot delete an approved run" }, { status: 400 });

    // حذف عناصر المسير أولاً
    await supabase
      .from("payroll_run_items")
      .delete()
      .eq("payroll_run_id", id)
      .eq("organization_id", identity.organizationId);

    // ثم حذف المسير نفسه
    const { error: deleteError } = await supabase
      .from("payroll_runs")
      .delete()
      .eq("id", id)
      .eq("organization_id", identity.organizationId);

    if (deleteError) return NextResponse.json({ error: "Failed to delete run" }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}