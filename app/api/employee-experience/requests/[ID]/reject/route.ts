import "server-only";

import { NextResponse } from "next/server";

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
} from "@/lib/rbac/authorization";
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

    const rejectIndex =
      parts.lastIndexOf("reject");

    const id =
      rejectIndex > 0
        ? parts[rejectIndex - 1]
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

    const body = await request
      .json()
      .catch(() => ({}));

    const reason =
      typeof body.reason === "string"
        ? body.reason.trim()
        : undefined;

    const supabase =
      await createSupabaseServerClient();

    const identity =
      await resolveWorkspaceIdentity(supabase);

    if (
  !hasPermission(
        identity.role ?? "",
        PERMISSIONS.REQUESTS_MANAGE,
      )
    ) {
      return NextResponse.json(
        {
          error: "You do not have permission to reject requests.",
        },
        {
          status: 403,
        },
      );
    }

    const leaveManager =
      new LeaveManager(supabase);

    const leave =
      await leaveManager.reject(
        id,
        identity.organizationId,
        reason,
      );

    return NextResponse.json({
      data: {
        type: "leave_rejection",

        message:
          "The leave request has been rejected.",

        status: leave.status,

        leaveRequestId: leave.id,
      },

      action: {
        id: "reject-leave-request",
        status: "completed",
      },
    });
  } catch (error) {
    console.error(
      "Employee Experience leave rejection failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Leave rejection failed.",
      },
      {
        status: 500,
      },
    );
  }
}