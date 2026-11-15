import "server-only";

import { NextResponse } from "next/server";

import {
  createSupabaseServerClient,
} from "@/lib/supabase-auth/server";

import {
  resolveWorkspaceIdentity,
} from "@/lib/workspace-identity/tenantResolver";

import {
   PolicyManager,
   PolicyDuplicateError,
   normalizeWorkingDays,
   WORKING_DAYS_LEAVE_TYPES,
 } from "@/src/enterprise/business/policies/policyManager";

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
        PERMISSIONS.POLICIES_MANAGE,
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
    const leaveSettings = await policyManager.getLeaveSettings(
      identity.organizationId,
    );

    return NextResponse.json({ data: policies, leaveSettings });
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

    const policyType =
      typeof body.policyType === "string" ? body.policyType : null; // CHANGED

    const policy = await policyManager.create({
      organizationId: identity.organizationId,
      companyId: identity.companyId,
      category,
      policyType, // CHANGED
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

    if (error instanceof PolicyDuplicateError) { 
      return NextResponse.json(
        { error: error.message, code: "POLICY_DUPLICATE" },
        { status: 409 },
      );
    }

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

/** PUT { leaveType, workingDays } — weekdays (0=Sun..6=Sat) counted for ONE leave type. */
export async function PUT(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const identity = await resolveWorkspaceIdentity(supabase);

    if (!hasPermission(identity.role ?? "", PERMISSIONS.POLICIES_MANAGE)) {
      return NextResponse.json(
        { error: "You do not have permission to manage policies." },
        { status: 403 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const leaveType = typeof body.leaveType === "string" ? body.leaveType : "";
    const workingDays = normalizeWorkingDays(body.workingDays);

    if (
      !(WORKING_DAYS_LEAVE_TYPES as readonly string[]).includes(leaveType) ||
      !workingDays
    ) {
      return NextResponse.json(
        { error: "A valid leave type and at least one working day are required." },
        { status: 400 },
      );
    }

    await new PolicyManager(supabase).saveWorkingDays(
      identity.organizationId,
      identity.companyId,
      leaveType as (typeof WORKING_DAYS_LEAVE_TYPES)[number],
      workingDays,
    );

    return NextResponse.json({ data: { leaveType, workingDays } });
  } catch (error) {
    console.error("Leave working days save failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save working days." },
      { status: 500 },
    );
  }
}