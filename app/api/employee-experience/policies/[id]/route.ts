import "server-only";

import { NextResponse } from "next/server";

import {
  createSupabaseServerClient,
} from "@/lib/supabase-auth/server";

import {
  resolveWorkspaceIdentity,
} from "@/lib/workspace-identity/tenantResolver";

import {
  hasPermission,
} from "@/lib/rbac/authorization";
import {
  PERMISSIONS
} from "@/lib/rbac/permissions";

import { PolicyManager } from "@/src/enterprise/business/policies/policyManager";


function extractId(request: Request): string {
  const url = new URL(request.url);
  const parts = url.pathname.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

export async function PATCH(request: Request) {
  try {
    const id = extractId(request);

    if (!id) {
      return NextResponse.json(
        { error: "A policy ID is required." },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();
    const identity = await resolveWorkspaceIdentity(supabase);

    if (
        !hasPermission(
          identity.role ?? "",
          PERMISSIONS.POLICIES_MANAGE,
        )
      ) {
        return NextResponse.json(
          {
            error: "You do not have permission to manage policies.",
          },
          {
            status: 403,
          },
        );
      }

    const body = await request.json().catch(() => ({}));

    const policyManager = new PolicyManager(supabase);

    const policy = await policyManager.update(
      id,
      identity.organizationId,
      {
        title:
          typeof body.title === "string" ? body.title : undefined,
        content:
          typeof body.content === "string"
            ? body.content
            : undefined,
        category:
          typeof body.category === "string"
            ? body.category
            : undefined,
      },
    );

    return NextResponse.json({ data: policy });
  } catch (error) {
    console.error("Policy update failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update policy.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const id = extractId(request);

    if (!id) {
      return NextResponse.json(
        { error: "A policy ID is required." },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();
    const identity = await resolveWorkspaceIdentity(supabase);

    if (
      !hasPermission(
        identity.role ?? "",
        PERMISSIONS.POLICIES_MANAGE,
      )
      ) {
        return NextResponse.json(
          {
            error: "You do not have permission to manage policies.",
          },
          {
            status: 403,
          },
        );
      }

    const policyManager = new PolicyManager(supabase);
    await policyManager.delete(id, identity.organizationId);

    return NextResponse.json({
      data: { id, deleted: true },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json(
        { error: "Access restricted to HR/Admin." },
        { status: 403 },
      );
    }

    console.error("Policy deletion failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete policy.",
      },
      { status: 500 },
    );
  }
}