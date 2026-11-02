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
  usageThroughDate?: unknown;
  usage?: unknown;
};

function isUuid(value: unknown): value is string {
  return typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function isDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
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

  if (error || membership?.role !== "owner") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { admin, identity, user };
}

async function validateEmployee(admin: ReturnType<typeof createSupabaseAdminClient>, organizationId: string, employeeUserId: string) {
  const { data, error } = await admin
    .from("organization_memberships")
    .select("user_id")
    .eq("organization_id", organizationId)
    .eq("user_id", employeeUserId)
    .maybeSingle();
  return !error && Boolean(data);
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

  const { data, error } = await auth.admin
    .from("employee_leave_usage")
    .select("leave_type, used_days, usage_through_date")
    .eq("organization_id", auth.identity.organizationId)
    .eq("employee_user_id", employeeUserId)
    .eq("leave_year", leaveYear);

  if (error) {
    console.error("Previous leave usage load failed:", error);
    return NextResponse.json({ error: "Unable to load previous leave usage." }, { status: 500 });
  }

  const usage: Record<string, number> = Object.fromEntries(LEAVE_TYPES.map((type) => [type, 0]));
  for (const row of data ?? []) usage[row.leave_type] = Number(row.used_days);

  return NextResponse.json({
    leaveYear,
    usageThroughDate: data?.[0]?.usage_through_date ?? new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Riyadh" }),
    usage,
  });
}

export async function PUT(request: Request) {
  const auth = await getAuthorizedContext();
  if ("error" in auth) return auth.error;

  let body: UsageBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { employeeUserId, leaveYear, usageThroughDate, usage } = body;
  const todayInRiyadh = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Riyadh" });
  if (!isUuid(employeeUserId) || leaveYear !== currentRiyadhYear() || !isDate(usageThroughDate) ||
      usageThroughDate.slice(0, 4) !== String(leaveYear) || usageThroughDate > todayInRiyadh ||
      typeof usage !== "object" || usage === null || Array.isArray(usage)) {
    return NextResponse.json({ error: "Invalid leave usage data." }, { status: 400 });
  }

  if (!(await validateEmployee(auth.admin, auth.identity.organizationId, employeeUserId))) {
    return NextResponse.json({ error: "Employee does not belong to this organization." }, { status: 404 });
  }

  const usageRecord = usage as Record<string, unknown>;
  const rows = [];
  for (const type of LEAVE_TYPES) {
    const value = usageRecord[type];
    const days = typeof value === "number" ? value : typeof value === "string" && value.trim() ? Number(value) : NaN;
    if (!Number.isFinite(days) || days < 0 || days > 366 || Math.round(days * 100) !== days * 100) {
      return NextResponse.json({ error: `Invalid used days for ${type}.` }, { status: 400 });
    }
    rows.push({
      organization_id: auth.identity.organizationId,
      employee_user_id: employeeUserId,
      leave_type: type,
      leave_year: leaveYear,
      used_days: days,
      usage_through_date: usageThroughDate,
      updated_by: auth.user.id,
    });
  }

  const { error } = await auth.admin
    .from("employee_leave_usage")
    .upsert(rows, { onConflict: "organization_id,employee_user_id,leave_type,leave_year" });

  if (error) {
    console.error("Previous leave usage save failed:", error);
    return NextResponse.json({ error: "Unable to save previous leave usage." }, { status: 500 });
  }

  return NextResponse.json({ success: true, leaveYear, usageThroughDate });
}
