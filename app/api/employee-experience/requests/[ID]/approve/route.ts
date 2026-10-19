import "server-only";

import { NextResponse } from "next/server";4

import {
  createSupabaseServerClient,
} from "@/lib/supabase-auth/server";

import {
  resolveWorkspaceIdentity,
} from "@/lib/workspace-identity/tenantResolver";

import {
  LeaveManager,
} from "@/src/enterprise/business/leave";
import {
  hasPermission,
}from "@/lib/rbac/authorization";
import {
  PERMISSIONS
} from "@/lib/rbac/permissions";

export async function POST(
  request: Request,
) {
  try {
    const url = new URL(request.url);

    const parts = url.pathname
      .split("/")
      .filter(Boolean);

    const approveIndex =
      parts.lastIndexOf("approve");

    const id =
      approveIndex > 0
        ? parts[approveIndex - 1]
        : "";

    if (!id) {
      return NextResponse.json(
        {
          error:
            "A leave request ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const supabase =
      await createSupabaseServerClient();

    const identity =
      await resolveWorkspaceIdentity(supabase); // <-- NEW

    if (
  !hasPermission(
    identity.role ?? "",
    PERMISSIONS.REQUESTS_MANAGE,
  )
  ) {
    return NextResponse.json(
      {
        error: "You do not have permission to approve requests.",
      },
      {
        status: 403,
      },
    );
}

    const leaveManager =
      new LeaveManager(supabase);

    const leave =
      await leaveManager.approve(
        id,
        identity.organizationId, // <-- NEW
      );

    return NextResponse.json({
      data: {
        type: "leave_approval",

        message:
          "The leave request has been approved.",

        status: leave.status,

        leaveRequestId: leave.id,
      },

      action: {
        id: "approve-leave-request",
        status: "completed",
      },
    });
  } catch (error) {
    console.error(
      "Employee Experience leave approval failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Leave approval failed.",
      },
      {
        status: 500,
      },
    );
  }
}