import "server-only";

import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase-auth/server";
import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";
import { resolveWorkspaceIdentity } from "@/lib/workspace-identity/tenantResolver";
import { LeaveManager } from "@/src/enterprise/business/leave";
import { hasPermission } from "@/lib/rbac/authorization";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { ApprovalRepository } from "@/src/enterprise/business/approvals";

/**
 * Direct (legacy) approval: ONLY for leave requests that have no approval workflow instance.
 * Requests running through a workflow are decided via POST /api/approvals/{instanceId}/decision.
 */
export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(Boolean);
    const approveIndex = parts.lastIndexOf("approve");
    const id = approveIndex > 0 ? parts[approveIndex - 1] : "";

    if (!id) {
      return NextResponse.json({ error: "A leave request ID is required." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const identity = await resolveWorkspaceIdentity(supabase);

    if (!hasPermission(identity.role ?? "", PERMISSIONS.APPROVALS_MANAGE)) {
      return NextResponse.json(
        { error: "You do not have permission to approve requests." },
        { status: 403 },
      );
    }

    const admin = createSupabaseAdminClient();

    const managed = await new ApprovalRepository(admin).getInstanceBySubject(
      identity.organizationId,
      "leave",
      id,
    );
    if (managed) {
      return NextResponse.json(
        { error: "This request is managed by an approval workflow.", code: "MANAGED_BY_WORKFLOW" },
        { status: 409 },
      );
    }

    const { data: row, error: rowError } = await admin
      .from("employee_requests")
      .select("user_id,status")
      .eq("id", id)
      .eq("organization_id", identity.organizationId)
      .eq("request_type", "leave")
      .maybeSingle();

    if (rowError) throw new Error(rowError.message);
    if (!row) {
      return NextResponse.json({ error: "Leave request not found." }, { status: 404 });
    }
    if (row.user_id === identity.userId) {
      return NextResponse.json({ error: "You cannot decide on your own request." }, { status: 403 });
    }
    if (row.status !== "pending") {
      return NextResponse.json({ error: "This request was already processed." }, { status: 409 });
    }

    const leaveManager = new LeaveManager(supabase);
    const leave = await leaveManager.approve(id, identity.organizationId);

    return NextResponse.json({
      data: {
        type: "leave_approval",
        message: "The leave request has been approved.",
        status: leave.status,
        leaveRequestId: leave.id,
      },
      action: { id: "approve-leave-request", status: "completed" },
    });
  } catch (error) {
    console.error("Employee Experience leave approval failed:", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Leave approval failed." },
      { status: 500 },
    );
  }
}