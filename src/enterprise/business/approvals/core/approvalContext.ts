import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-auth/server";
import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";
import { resolveWorkspaceIdentity } from "@/lib/workspace-identity/tenantResolver";
import { hasPermission } from "@/lib/rbac/authorization";
import { PERMISSIONS, type Permission } from "@/lib/rbac/permissions";
import { ApprovalError } from "../types/approvalTypes";

/** User + company come ONLY from the server-side session, never from the request body/query. */
export async function getApprovalContext(permission?: Permission) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

    const identity = await resolveWorkspaceIdentity(supabase);
    if (!identity?.organizationId) return { error: NextResponse.json({ error: "Workspace not found" }, { status: 403 }) };

    const role = identity.role ?? "";
    if (permission && !hasPermission(role, permission)) {
      return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    }
    return {
      db: createSupabaseAdminClient(),
      userId: user.id,
      organizationId: identity.organizationId as string,
      canManage: hasPermission(role, PERMISSIONS.APPROVALS_MANAGE),
    };
  } catch (e) {
    console.warn("Approval context failed:", e);
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
}

export function approvalErrorResponse(e: unknown) {
  if (e instanceof ApprovalError) {
    return NextResponse.json({ error: e.message, code: e.code }, { status: e.status });
  }
  console.error("Approvals API failed:", e);
  return NextResponse.json({ error: "Unable to process the request." }, { status: 500 });
}