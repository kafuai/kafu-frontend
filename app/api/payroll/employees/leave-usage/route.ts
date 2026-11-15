import "server-only";

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-auth/server";
import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";
import { resolveWorkspaceIdentity } from "@/lib/workspace-identity/tenantResolver";
import { hasPermission } from "@/lib/rbac/authorization";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import type { LeaveType } from "@/src/enterprise/business/leave";

const LEAVE_TYPES: readonly LeaveType[] = ["annual", "sick", "emergency", "unpaid", "maternity"];

type UsageBody = {
  employeeUserId?: unknown;
  leaveYear?: unknown;
  usage?: unknown;
};

function isUuid(value: unknown): value is string {
  return typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function currentRiyadhYear(): number {
  return Number(new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Riyadh",
    year: "numeric",
  }).format(new Date()));
}

async function getAuthorizedContext() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const identity = await resolveWorkspaceIdentity(supabase);
  if (!identity?.organizationId || !hasPermission(identity.role ?? "", PERMISSIONS.PAYROLL_EMPLOYEES_MANAGE)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  const admin = createSupabaseAdminClient();
  const { data: membership, error } = await admin
    .from("organization_memberships")
    .select("role")
    .eq("organization_id", identity.organizationId)
    .eq("user_id", user.id)
    .maybeSingle();

  // Leave usage baseline and corrections are restricted to the organization Owner.
  if (error || membership?.role !== "owner") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { admin, identity, user };
}

async function validateEmployee(
  admin: ReturnType<typeof createSupabaseAdminClient>,
  organizationId: string,
  employeeUserId: string,
) {
  const { data, error } = await admin
    .from("organization_memberships")
    .select("user_id")
    .eq("organization_id", organizationId)
    .eq("user_id", employeeUserId)
    .maybeSingle();
  return !error && Boolean(data);
}

function parseUsage(value: unknown): Record<LeaveType, number> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;

  const source = value as Record<string, unknown>;
  const normalized = {} as Record<LeaveType, number>;
  for (const type of LEAVE_TYPES) {
    const raw = source[type];
    const days = typeof raw === "number"
      ? raw
      : typeof raw === "string" && /^\d+(?:\.\d{1,2})?$/.test(raw.trim())
        ? Number(raw)
        : NaN;

    if (!Number.isFinite(days) || days < 0 || days > 366 || Math.round(days * 100) !== days * 100) {
      return null;
    }
    normalized[type] = days;
  }
  return normalized;
}

async function parseBody(request: Request): Promise<UsageBody | NextResponse> {
  try {
    return await request.json() as UsageBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
}

function validateBody(body: UsageBody) {
  if (!isUuid(body.employeeUserId) || body.leaveYear !== currentRiyadhYear()) {
    return { error: NextResponse.json({ error: "Invalid employee or leave year." }, { status: 400 }) };
  }
  const usage = parseUsage(body.usage);
  if (!usage) {
    return { error: NextResponse.json({ error: "Enter valid used days from 0 to 366 with up to two decimal places." }, { status: 400 }) };
  }
  return { employeeUserId: body.employeeUserId, leaveYear: body.leaveYear, usage };
}

export async function GET(request: Request) {
  const auth = await getAuthorizedContext();
  if ("error" in auth) return auth.error;

  const url = new URL(request.url);
  const employeeUserId = url.searchParams.get("employeeUserId");
  const leaveYear = Number(url.searchParams.get("leaveYear") ?? currentRiyadhYear());

  if (!isUuid(employeeUserId) || !Number.isInteger(leaveYear) || leaveYear !== currentRiyadhYear()) {
    return NextResponse.json({ error: "Invalid employee or leave year." }, { status: 400 });
  }
  if (!(await validateEmployee(auth.admin, auth.identity.organizationId, employeeUserId))) {
    return NextResponse.json({ error: "Employee does not belong to this organization." }, { status: 404 });
  }

  const [{ data, error }, { data: initialization, error: initializationError }] = await Promise.all([
    auth.admin
      .from("employee_leave_usage")
      .select("leave_type, used_days, updated_by, updated_at")
      .eq("organization_id", auth.identity.organizationId)
      .eq("employee_user_id", employeeUserId)
      .eq("leave_year", leaveYear)
      .order("updated_at", { ascending: false }),
    auth.admin
      .from("employee_leave_usage_initializations")
      .select("id")
      .eq("organization_id", auth.identity.organizationId)
      .eq("employee_user_id", employeeUserId)
      .eq("leave_year", leaveYear)
      .maybeSingle(),
  ]);

  if (error) {
    console.error("Leave usage load failed:", error);
    return NextResponse.json({ error: "Unable to load leave usage." }, { status: 500 });
  }
  if (initializationError) {
    console.error("Leave usage initialization status failed:", initializationError);
    return NextResponse.json({ error: "Unable to load leave usage initialization status." }, { status: 500 });
  }

  const usage: Record<LeaveType, number> = Object.fromEntries(LEAVE_TYPES.map((type) => [type, 0])) as Record<LeaveType, number>;
  for (const row of data ?? []) usage[row.leave_type as LeaveType] = Number(row.used_days);
  const latestUpdate = data?.[0];
  let lastUpdatedByName: string | null = null;
  if (latestUpdate?.updated_by) {
    const { data: updaterProfile } = await auth.admin
      .from("profiles")
      .select("full_name")
      .eq("id", latestUpdate.updated_by)
      .maybeSingle();
    lastUpdatedByName = updaterProfile?.full_name ?? null;
  }

  return NextResponse.json({
    leaveYear,
    usage,
    initialized: Boolean(initialization),
    lastUpdatedBy: latestUpdate?.updated_by ?? null,
    lastUpdatedByName,
    lastUpdatedAt: latestUpdate?.updated_at ?? null,
  });
}

/** One-time baseline initialization. Repeated calls are rejected by the database marker. */
export async function POST(request: Request) {
  const auth = await getAuthorizedContext();
  if ("error" in auth) return auth.error;

  const body = await parseBody(request);
  if (body instanceof NextResponse) return body;
  const validated = validateBody(body);
  if ("error" in validated) return validated.error;

  if (!(await validateEmployee(auth.admin, auth.identity.organizationId, validated.employeeUserId))) {
    return NextResponse.json({ error: "Employee does not belong to this organization." }, { status: 404 });
  }

  const { error } = await auth.admin.rpc("initialize_employee_leave_usage", {
    p_organization_id: auth.identity.organizationId,
    p_employee_user_id: validated.employeeUserId,
    p_leave_year: validated.leaveYear,
    p_actor_id: auth.user.id,
    p_usage: validated.usage,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Leave usage has already been initialized. Use manual edit to correct it." }, { status: 409 });
    }
    console.error("Leave usage initialization failed:", error);
    return NextResponse.json({ error: "Unable to initialize leave usage." }, { status: 500 });
  }

  return NextResponse.json({ success: true, leaveYear: validated.leaveYear, initialized: true });
}

/** Manual correction after initialization. This is a single atomic upsert statement. */
export async function PUT(request: Request) {
  const auth = await getAuthorizedContext();
  if ("error" in auth) return auth.error;

  const body = await parseBody(request);
  if (body instanceof NextResponse) return body;
  const validated = validateBody(body);
  if ("error" in validated) return validated.error;

  if (!(await validateEmployee(auth.admin, auth.identity.organizationId, validated.employeeUserId))) {
    return NextResponse.json({ error: "Employee does not belong to this organization." }, { status: 404 });
  }

  const { data: initialization, error: initializationError } = await auth.admin
    .from("employee_leave_usage_initializations")
    .select("id")
    .eq("organization_id", auth.identity.organizationId)
    .eq("employee_user_id", validated.employeeUserId)
    .eq("leave_year", validated.leaveYear)
    .maybeSingle();

  if (initializationError) {
    console.error("Leave usage initialization check failed:", initializationError);
    return NextResponse.json({ error: "Unable to verify leave usage initialization." }, { status: 500 });
  }
  if (!initialization) {
    return NextResponse.json({ error: "Initialize leave usage before making manual corrections." }, { status: 409 });
  }

  const now = new Date().toISOString();
  const rows = LEAVE_TYPES.map((leaveType) => ({
    organization_id: auth.identity.organizationId,
    employee_user_id: validated.employeeUserId,
    leave_type: leaveType,
    leave_year: validated.leaveYear,
    used_days: validated.usage[leaveType],
    updated_by: auth.user.id,
    updated_at: now,
  }));

  const { error } = await auth.admin
    .from("employee_leave_usage")
    .upsert(rows, { onConflict: "organization_id,employee_user_id,leave_type,leave_year" });

  if (error) {
    console.error("Manual leave usage update failed:", error);
    return NextResponse.json({ error: "Unable to save manual leave usage changes." }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    leaveYear: validated.leaveYear,
    updatedBy: auth.user.id,
    updatedAt: now,
  });
}
