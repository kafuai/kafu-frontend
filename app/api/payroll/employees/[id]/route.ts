import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-auth/server";
import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";
import { resolveWorkspaceIdentity } from "@/lib/workspace-identity/tenantResolver";
import { hasPermission } from "@/lib/rbac/authorization";
import { PERMISSIONS } from "@/lib/rbac/permissions";

const EMPLOYEE_FIELDS = [
  "id",
  "organization_id",
  "user_id",
  "employee_number",
  "full_name",
  "national_id",
  "status",
  "hire_date",
  "nationality",
  "is_saudi",
  "date_of_birth",
  "phone",
  "job_title",
  "department",
  "contract_type",
  "contract_start_date",
  "contract_end_date",
  "basic_salary",
  "housing_allowance",
  "other_allowances",
  "deductions",
  "bank_name",
  "iban",
  "created_at",
  "updated_at",
].join(", ");

type Body = Record<string, unknown>;

type RouteContext = {
  params: Promise<{ id: string }>;
};

const EMPLOYEE_EDITABLE_FIELDS = ["phone", "bank_name", "iban"];

function isObject(value: unknown): value is Body {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value;
}

function parseMoney(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) &&
      value >= 0 &&
      Math.round(value * 100) === value * 100
      ? value
      : null;
  }

  if (typeof value !== "string" || !/^\d+(\.\d{1,2})?$/.test(value)) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

async function getContext() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const identity = await resolveWorkspaceIdentity(supabase);

  if (!identity?.organizationId) {
    return { error: NextResponse.json({ error: "Workspace not found" }, { status: 403 }) };
  }
const admin = createSupabaseAdminClient();
  const { data: membership, error: membershipError } = await admin
    .from("organization_memberships")
    .select("role")
    .eq("organization_id", identity.organizationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (membershipError || !membership) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return {
    supabase,
    user,
    identity,
    isOwner: membership.role === "owner",
  };
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await getContext();

  if ("error" in auth) return auth.error;

  const { supabase, user, identity, isOwner } = auth;
  const { id } = await context.params;

  if (!isUuid(id)) {
    return NextResponse.json({ error: "Invalid employee ID" }, { status: 400 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isObject(body) || Object.keys(body).length === 0) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (isOwner && hasPermission(identity.role, PERMISSIONS.PAYROLL_EMPLOYEES_MANAGE)) {
    const allowedFields = [
      "user_id",
      "employee_number",
      "full_name",
      "national_id",
      "status",
      "hire_date",
      "nationality",
      "is_saudi",
      "date_of_birth",
      "phone",
      "job_title",
      "department",
      "contract_type",
      "contract_start_date",
      "contract_end_date",
      "basic_salary",
      "housing_allowance",
      "other_allowances",
      "deductions",
      "bank_name",
      "iban",
    ];

    const unknownFields = Object.keys(body).filter((field) => !allowedFields.includes(field));

    if (unknownFields.length > 0) {
      return NextResponse.json(
        { error: `Unsupported fields: ${unknownFields.join(", ")}` },
        { status: 400 },
      );
    }

    if ("employee_number" in body &&
      (typeof body.employee_number !== "string" || !body.employee_number.trim())) {
      return NextResponse.json({ error: "Invalid employee_number" }, { status: 400 });
    }

    if ("full_name" in body &&
      (typeof body.full_name !== "string" || !body.full_name.trim())) {
      return NextResponse.json({ error: "Invalid full_name" }, { status: 400 });
    }

    if ("is_saudi" in body && typeof body.is_saudi !== "boolean") {
      return NextResponse.json(
        { error: "Invalid is_saudi" },
        { status: 400 },
      );
    }
    if ("status" in body && body.status !== "active" && body.status !== "inactive") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    for (const field of [
      "national_id",
      "nationality",
      "phone",
      "job_title",
      "department",
      "contract_type",
      "bank_name",
      "iban",
    ]) {
      if (
        field in body &&
        body[field] !== null &&
        (typeof body[field] !== "string" || body[field].length > 500)
      ) {
        return NextResponse.json({ error: `Invalid ${field}` }, { status: 400 });
      }
    }

    for (const field of ["hire_date", "date_of_birth", "contract_start_date", "contract_end_date"]) {
      if (field in body && body[field] !== null &&
        (typeof body[field] !== "string" || !isValidDate(body[field]))) {
        return NextResponse.json({ error: `Invalid ${field}` }, { status: 400 });
      }
    }

    const money: Record<string, number> = {};

    for (const field of [
      "basic_salary",
      "housing_allowance",
      "other_allowances",
      "deductions",
    ]) {
      if (field in body) {
        const parsed = parseMoney(body[field]);

        if (parsed === null) {
          return NextResponse.json({ error: `Invalid ${field}` }, { status: 400 });
        }

        money[field] = parsed;
      }
    }

    if (
      typeof body.contract_start_date === "string" &&
      typeof body.contract_end_date === "string" &&
      body.contract_end_date < body.contract_start_date
    ) {
      return NextResponse.json({ error: "Contract end date cannot precede start date" }, { status: 400 });
    }

    if ("user_id" in body && body.user_id !== null) {
      if (typeof body.user_id !== "string" || !isUuid(body.user_id)) {
        return NextResponse.json({ error: "Invalid user_id" }, { status: 400 });
      }

      const admin = createSupabaseAdminClient();
      
      // 2. استخدام admin بدلاً من supabase
      const { data: linkedMembership, error: linkedMembershipError } = await admin
        .from("organization_memberships")
        .select("user_id")
        .eq("organization_id", identity.organizationId)
        .eq("user_id", body.user_id)
        .maybeSingle();

      if (linkedMembershipError) {
        return NextResponse.json({ error: "Failed to validate employee account" }, { status: 500 });
      }

      if (!linkedMembership) {
        return NextResponse.json({ error: "User is not a member of this organization" }, { status: 400 });
      }
    }

    const updateData: Record<string, unknown> = {
      ...money,
      updated_at: new Date().toISOString(),
    };

    for (const [field, value] of Object.entries(body)) {
      if (field in money) continue;

      updateData[field] = typeof value === "string" ? value.trim() || null : value;
    }

    const { data, error } = await supabase
      .from("payroll_employees")
      .update(updateData)
      .eq("id", id)
      .eq("organization_id", identity.organizationId)
      .select(EMPLOYEE_FIELDS)
      .maybeSingle();

    if (error?.code === "23505") {
      return NextResponse.json({ error: "Employee number or linked account already exists" }, { status: 409 });
    }

    if (error) {
      return NextResponse.json({ error: "Failed to update employee" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json({ employee: data });
  }

  // Employees can update contact/bank fields only.
  const forbiddenFields = Object.keys(body).filter(
    (field) => !EMPLOYEE_EDITABLE_FIELDS.includes(field),
  );

  if (forbiddenFields.length > 0) {
    return NextResponse.json(
      { error: "Employees can only update phone, bank_name, and iban" },
      { status: 403 },
    );
  }

  for (const field of EMPLOYEE_EDITABLE_FIELDS) {
    if (
      field in body &&
      body[field] !== null &&
      (typeof body[field] !== "string" || body[field].length > 500)
    ) {
      return NextResponse.json({ error: `Invalid ${field}` }, { status: 400 });
    }
  }

  // Verify that the requested record belongs to the authenticated employee.
  const { data: employee, error: employeeError } = await supabase
    .from("payroll_employees")
    .select("id")
    .eq("id", id)
    .eq("organization_id", identity.organizationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (employeeError) {
    return NextResponse.json({ error: "Failed to validate employee record" }, { status: 500 });
  }

  if (!employee) {
    return NextResponse.json({ error: "Employee record not found" }, { status: 404 });
  }

  const { error: rpcError } = await supabase.rpc(
    "update_own_payroll_employee_contact",
    {
      p_organization_id: identity.organizationId,
      p_phone: body.phone === undefined ? null : body.phone as string | null,
      p_bank_name: body.bank_name === undefined ? null : body.bank_name as string | null,
      p_iban: body.iban === undefined ? null : body.iban as string | null,
    },
  );

  if (rpcError) {
    return NextResponse.json({ error: "Failed to update employee contact details" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await getContext();

  if ("error" in auth) return auth.error;

  const { supabase, identity, isOwner } = auth;
  const { id } = await context.params;

  if (!isUuid(id)) {
    return NextResponse.json({ error: "Invalid employee ID" }, { status: 400 });
  }

  if (
    !isOwner ||
    !hasPermission(identity.role, PERMISSIONS.PAYROLL_EMPLOYEES_MANAGE)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: history, error: historyError } = await supabase
    .from("payroll_run_items")
    .select("id")
    .eq("employee_id", id)
    .limit(1);

  if (historyError) {
    return NextResponse.json({ error: "Failed to check payroll history" }, { status: 500 });
  }

  if (history?.length) {
    return NextResponse.json(
      { error: "Cannot delete an employee with payroll history" },
      { status: 409 },
    );
  }

  const { data, error } = await supabase
    .from("payroll_employees")
    .delete()
    .eq("id", id)
    .eq("organization_id", identity.organizationId)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
