import "server-only";

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-auth/server";
import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";
import { resolveWorkspaceIdentity } from "@/lib/workspace-identity/tenantResolver";
import { hasPermission } from "@/lib/rbac/authorization";
import { PERMISSIONS } from "@/lib/rbac/permissions";

/** HR/Owner cancellation of an already approved leave request. */
export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(Boolean);
    const cancelIndex = parts.lastIndexOf("cancel");
    const id = cancelIndex > 0 ? parts[cancelIndex - 1] : "";
    if (!id) return NextResponse.json({ error: "A leave request ID is required." }, { status: 400 });

    const supabase = await createSupabaseServerClient();
    const identity = await resolveWorkspaceIdentity(supabase);
    if (!hasPermission(identity.role ?? "", PERMISSIONS.APPROVALS_MANAGE)) {
      return NextResponse.json({ error: "You do not have permission to cancel approved leave." }, { status: 403 });
    }

    const admin = createSupabaseAdminClient();
    const { data, error } = await admin.rpc("cancel_approved_leave_request", {
      p_request_id: id,
      p_organization_id: identity.organizationId,
      p_actor_id: identity.userId,
    });
    if (error) {
      const status = error.code === "P0002" ? 404 : error.code === "40001" ? 409 : 500;
      return NextResponse.json({ error: error.message }, { status });
    }

    return NextResponse.json({
      data: {
        type: "leave_cancellation",
        message: "The approved leave request has been cancelled.",
        status: "cancelled",
        leaveRequestId: id,
        alreadyProcessed: Boolean(data?.already_processed),
      },
      action: { id: "cancel-approved-leave-request", status: "completed" },
    });
  } catch (error) {
    console.error("Approved leave cancellation failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Leave cancellation failed." },
      { status: 500 },
    );
  }
}
