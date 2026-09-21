import "server-only";

import { NextResponse } from "next/server";


import {
  PolicyManager,
} from "@/src/enterprise/business/policies/policyManager";

import {
  createSupabaseServerClient,
} from "@/lib/supabase-auth/server";

import {
  resolveWorkspaceIdentity,
} from "@/lib/workspace-identity/tenantResolver";

import {
  EmployeeExperienceAgent,
} from "@/src/enterprise/ai/agents/employeeExperience/employeeExperience";

import {
  createEmployeeExperienceAgentProfile,
} from "@/src/enterprise/ai/agents/employeeExperience/employeeExperienceAgentProfile";

import {
  LeaveManager,
} from "@/src/enterprise/business/leave";

import {
  EmploymentLetterManager,
} from "@/src/enterprise/business/employmentLetters/employmentLetterManager";

import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const identity = await resolveWorkspaceIdentity(supabase);

    const url = new URL(request.url);
    const mineOnly = url.searchParams.get("mine") === "true";

    const leaveManager = new LeaveManager(supabase);
    const employmentLetterManager = new EmploymentLetterManager(supabase);

    const employeeIdFilter = mineOnly ? identity.userId : undefined;

    const [leaveRequests, letterRequests] = await Promise.all([
      leaveManager.list(identity.organizationId, employeeIdFilter),
      employmentLetterManager.list(identity.organizationId, employeeIdFilter),
    ]);

    const combined = [
      ...leaveRequests.map((leave) => ({
        id: leave.id,
        employeeId: leave.employeeId,
        requestType: "leave" as const,
        status: leave.status,
        reason: leave.reason,
        startDate: leave.startDate,
        endDate: leave.endDate,
        createdAt: leave.createdAt,
      })),
      ...letterRequests.map((letter) => ({
        id: letter.id,
        employeeId: letter.employeeId,
        requestType: "employment_letter" as const,
        status: letter.status,
        reason: letter.reason,
        startDate: undefined,
        endDate: undefined,
        createdAt: letter.createdAt,
      })),
    ].sort((a, b) => b.createdAt - a.createdAt);

    const uniqueEmployeeIds = Array.from(
      new Set(combined.map((item) => item.employeeId)),
    );

    let profilesById = new Map<string, string>();

    if (uniqueEmployeeIds.length > 0) {
      const adminClient = createSupabaseAdminClient();

      const { data: profiles, error: profilesError } = await adminClient
        .from("profiles")
        .select("id, full_name, email")
        .in("id", uniqueEmployeeIds);

      if (profilesError) {
        console.error("Failed to load employee profiles:", profilesError);
      } else {
        profilesById = new Map(
          (profiles ?? []).map((profile) => [
            profile.id,
            profile.full_name?.trim() || profile.email || profile.id,
          ]),
        );
      }
    }

    const withNames = combined.map((item) => ({
      ...item,
      employeeName:
        profilesById.get(item.employeeId) ?? item.employeeId,
    }));

    return NextResponse.json({ data: withNames });
  } catch (error) {
    console.error("Employee Experience requests fetch failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load employee requests.",
      },
      { status: 500 },
    );
  }
}
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const identity = await resolveWorkspaceIdentity(supabase);

    const body = await request.json();

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    const locale =
      typeof body.locale === "string" ? body.locale : undefined;

    if (!message) {
      return NextResponse.json(
        { error: "A message is required." },
        { status: 400 },
      );
    }

    const profile = createEmployeeExperienceAgentProfile(
      identity.organizationId,
    );

    const leaveManager = new LeaveManager(supabase);

    const policyManager = new PolicyManager(supabase);

    const employmentLetterManager = new EmploymentLetterManager(supabase);

    const agent = new EmployeeExperienceAgent(
      profile,
      leaveManager,
      policyManager,
       employmentLetterManager,

    );

    const result = await agent.execute({
      message,
      employeeId: identity.userId,
      organizationId: identity.organizationId,
      companyId: identity.companyId,
      locale,
    });

    return NextResponse.json({
      data: result,
      agent: {
        id: profile.id,
        name: profile.name,
        status: profile.status,
      },
    });
  } catch (error) {
    console.error("Employee Experience Agent failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Agent execution failed.",
      },
      { status: 500 },
    );
  }
}