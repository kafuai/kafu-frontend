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

type PayrollEmployee = {
  id: string;
  user_id: string | null;
  full_name: string;
  [key: string]: unknown;
};

function isObject(value: unknown): value is Body {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isUuid(value: unknown): value is string {
  return typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
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
  if (typeof value !== "string" || !/^\d+(\.\d{1,2})?$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

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

async function getRequestContext() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const identity = await resolveWorkspaceIdentity(supabase);

  if (!identity?.organizationId) {
    return { error: NextResponse.json({ error: "Workspace not found" }, { status: 403 }) };
  }

  return { supabase, user, identity };
}

/* -------------------------------------------------------------------------- */
/*  GET                                                                       */
/*  Owner: every organization member (membership + profile), merged with     */
/*  the payroll_employees row if it exists (payroll = null otherwise).       */
/*  Non-owner: only their own payroll record.                                */
/* -------------------------------------------------------------------------- */
export async function GET() {
  const context = await getRequestContext();
  if ("error" in context) return context.error;

  const { supabase, user, identity } = context;
  const owner = await isOwner(supabase, user.id, identity.organizationId);

  if (owner && hasPermission(identity.role, PERMISSIONS.PAYROLL_VIEW)) {
    // The admin client is used ONLY after the owner check above, and every
    // query is explicitly scoped to the caller's organization.
    const admin = createSupabaseAdminClient();

    const [payrollRes, membersRes] = await Promise.all([
      supabase
        .from("payroll_employees")
        .select(EMPLOYEE_FIELDS)
        .eq("organization_id", identity.organizationId)
        .order("created_at", { ascending: false }),
      admin
        .from("organization_memberships")
        .select("user_id, role")
        .eq("organization_id", identity.organizationId),
    ]);

    if (payrollRes.error || membersRes.error) {
      console.error("Payroll employees load failed:", payrollRes.error ?? membersRes.error);
      return NextResponse.json({ error: "Failed to load employees" }, { status: 500 });
    }

    const payroll = (payrollRes.data ?? []) as unknown as PayrollEmployee[];
    const members = (membersRes.data ?? []) as { user_id: string; role: string | null }[];

    const memberIds = members.map((m) => m.user_id);
    const profilesById = new Map<string, { full_name: string | null; email: string | null }>();

    if (memberIds.length > 0) {
      const { data: profiles, error: profilesError } = await admin
        .from("profiles")
        .select("id, full_name, email")
        .in("id", memberIds);

      if (profilesError) {
        console.error("Profiles load failed:", profilesError);
        return NextResponse.json({ error: "Failed to load employees" }, { status: 500 });
      }

      for (const p of profiles ?? []) {
        profilesById.set(p.id, { full_name: p.full_name, email: p.email });
      }
    }

    const payrollByUser = new Map<string, PayrollEmployee>();
    for (const row of payroll) {
      if (row.user_id) payrollByUser.set(row.user_id, row);
    }

    // 1) every member (with or without a payroll row)
    const rows = members.map((member) => {
      const profile = profilesById.get(member.user_id);
      const record = payrollByUser.get(member.user_id) ?? null;
      return {
        key: member.user_id,
        user_id: member.user_id as string | null,
        full_name: record?.full_name || profile?.full_name?.trim() || profile?.email || "",
        email: profile?.email ?? null,
        role: member.role,
        payroll: record,
      };
    });

    // 2) payroll rows that are not linked to any membership
    const memberSet = new Set(memberIds);
    for (const row of payroll) {
      if (row.user_id && memberSet.has(row.user_id)) continue;
      rows.push({
        key: row.id,
        user_id: row.user_id,
        full_name: row.full_name,
        email: null,
        role: null,
        payroll: row,
      });
    }

    return NextResponse.json({ employees: rows, canManage: true });
  }

  // Non-owner users can only retrieve their own linked employee record.
  const { data, error } = await supabase
    .from("payroll_employees")
    .select(EMPLOYEE_FIELDS)
    .eq("organization_id", identity.organizationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Failed to load employee profile" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Employee record not found" }, { status: 404 });
  }

  return NextResponse.json({ employee: data, canManage: false });
}

/* -------------------------------------------------------------------------- */
/*  POST: create the payroll row for an existing organization member.        */
/*  ALL fields are required.                                                 */
/* -------------------------------------------------------------------------- */
const REQUIRED_TEXT_FIELDS = [
  "employee_number",
  "full_name",
  "national_id",
  "nationality",
  "phone",
  "job_title",
  "department",
  "contract_type",
  "bank_name",
  "iban",
] as const;

const REQUIRED_DATE_FIELDS = [
  "hire_date",
  "date_of_birth",
  "contract_start_date",
  "contract_end_date",
] as const;

const REQUIRED_MONEY_FIELDS = [
  "basic_salary",
  "housing_allowance",
  "other_allowances",
  "deductions",
] as const;

export async function POST(request: Request) {
  const context = await getRequestContext();
  if ("error" in context) return context.error;

  const { supabase, user, identity } = context;
  const owner = await isOwner(supabase, user.id, identity.organizationId);

  if (
    !owner ||
    !hasPermission(identity.role, PERMISSIONS.PAYROLL_EMPLOYEES_MANAGE)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isObject(body)) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const payload: Record<string, unknown> = {
    organization_id: identity.organizationId,
  };

  for (const field of REQUIRED_TEXT_FIELDS) {
    const value = body[field];
    if (typeof value !== "string" || !value.trim() || value.trim().length > 500) {
      return NextResponse.json({ error: `Invalid or missing ${field}` }, { status: 400 });
    }
    payload[field] = value.trim();
  }

  for (const field of REQUIRED_DATE_FIELDS) {
    const value = body[field];
    if (typeof value !== "string" || !isValidDate(value)) {
      return NextResponse.json({ error: `Invalid or missing ${field}` }, { status: 400 });
    }
    payload[field] = value;
  }

  if ((payload.contract_end_date as string) < (payload.contract_start_date as string)) {
    return NextResponse.json(
      { error: "Contract end date cannot precede start date" },
      { status: 400 },
    );
  }

  for (const field of REQUIRED_MONEY_FIELDS) {
    const parsed = parseMoney(body[field]);
    if (parsed === null) {
      return NextResponse.json({ error: `Invalid or missing ${field}` }, { status: 400 });
    }
    payload[field] = parsed;
  }

  if (typeof body.is_saudi !== "boolean") {
  return NextResponse.json(
    { error: "Invalid or missing is_saudi" },
    { status: 400 },
  );
}

payload.is_saudi = body.is_saudi;

  if (body.status !== "active" && body.status !== "inactive") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  payload.status = body.status;

  // user_id is required: the employee must come from the organization members.
  if (!isUuid(body.user_id)) {
    return NextResponse.json({ error: "Invalid or missing user_id" }, { status: 400 });
  }
   
  const admin = createSupabaseAdminClient();

  const { data: membership, error: membershipError } = await admin
    .from("organization_memberships")
    .select("user_id")
    .eq("organization_id", identity.organizationId)
    .eq("user_id", body.user_id)
    .maybeSingle();

  if (membershipError) {
    return NextResponse.json({ error: "Failed to validate employee account" }, { status: 500 });
  }

  if (!membership) {
    return NextResponse.json(
      { error: "The selected user is not a member of this organization" },
      { status: 400 },
    );
  }

  payload.user_id = body.user_id;

  const { data, error } = await supabase
    .from("payroll_employees")
    .insert(payload)
    .select(EMPLOYEE_FIELDS)
    .single();

  if (error?.code === "23505") {
    return NextResponse.json(
      { error: "Employee number or linked account already exists" },
      { status: 409 },
    );
  }

  if (error) {
    console.error("Payroll employee create failed:", error);
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 });
  }

  return NextResponse.json({ employee: data }, { status: 201 });
}