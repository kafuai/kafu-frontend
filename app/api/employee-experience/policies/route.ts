import "server-only";

import { NextResponse } from "next/server";

import {
  createSupabaseServerClient,
} from "@/lib/supabase-auth/server";

import {
  resolveWorkspaceIdentity,
} from "@/lib/workspace-identity/tenantResolver";

import { PolicyManager } from "@/src/enterprise/business/policies/policyManager";

import {
  hasPermission,
} from "@/lib/rbac/authorization";
import {
  PERMISSIONS
} from "@/lib/rbac/permissions";




export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const identity = await resolveWorkspaceIdentity(supabase);

    if (
      !hasPermission(
        identity.role ?? "",
        PERMISSIONS.POLICIES_VIEW,
      )
    ) {
      return NextResponse.json(
        {
          error: "You do not have permission to view policies.",
        },
        {
          status: 403,
        },
      );
    }

    const policyManager = new PolicyManager(supabase);
    const policies = await policyManager.listForOrganization(
      identity.organizationId,
    );

    return NextResponse.json({ data: policies });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json(
        { error: "Access restricted to HR/Admin." },
        { status: 403 },
      );
    }

    console.error("Policies fetch failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load policies.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
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

    const body = await request.json();

    const title =
      typeof body.title === "string" ? body.title.trim() : "";

    const content =
      typeof body.content === "string" ? body.content.trim() : "";

    const category =
      typeof body.category === "string" && body.category.trim()
        ? body.category.trim()
        : "general";

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required." },
        { status: 400 },
      );
    }

    const policyManager = new PolicyManager(supabase);

    const policy = await policyManager.create({
      organizationId: identity.organizationId,
      companyId: identity.companyId,
      category,
      title,
      content,
    });

    return NextResponse.json({ data: policy });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json(
        { error: "Access restricted to HR/Admin." },
        { status: 403 },
      );
    }

    console.error("Policy creation failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create policy.",
      },
      { status: 500 },
    );
  }
}