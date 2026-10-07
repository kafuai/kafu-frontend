import "server-only";

import { NextResponse } from "next/server";

import { PolicyManager } from "@/src/enterprise/business/policies/policyManager";

import { createSupabaseServerClient } from "@/lib/supabase-auth/server";

import { resolveWorkspaceIdentity } from "@/lib/workspace-identity/tenantResolver";

import { EmployeeExperienceAgent } from "@/src/enterprise/ai/agents/employeeExperience/employeeExperience";

import { createEmployeeExperienceAgentProfile } from "@/src/enterprise/ai/agents/employeeExperience/employeeExperienceAgentProfile";

import { resolveLeavePolicyAllowance } from "@/src/enterprise/ai/agents/employeeExperience/leavePolicyAllowance";

import {
  LeaveManager,
  LeaveValidationError,
  calculateLeaveBalance,
  countLeaveDays,
  type LeaveType,
} from "@/src/enterprise/business/leave";

import { EmploymentLetterManager } from "@/src/enterprise/business/employmentLetters/employmentLetterManager";

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

    // ------------------------------------------------------------------
    // Allowance per leave type (from the company policy text).
    // "other" is skipped: it has no fixed allowance to compute against.
    // An AI failure only hides the balance, it never breaks the page.
    // ------------------------------------------------------------------
    const policyManager = new PolicyManager(supabase);

    const typesToResolve = new Set<LeaveType>(
      leaveRequests.map((leave) => leave.type),
    );
    if (mineOnly) typesToResolve.add("annual");
    typesToResolve.delete("other");

    const allowanceByType = new Map<LeaveType, number | null>();

    await Promise.all(
      Array.from(typesToResolve).map(async (type) => {
        try {
          const policy = await resolveLeavePolicyAllowance({
            policyManager,
            organizationId: identity.organizationId,
            companyId: identity.companyId,
            employeeId: identity.userId,
            leaveType: type,
            userMessage: `How many days of ${type} leave is an employee entitled to per year?`,
          });

          allowanceByType.set(
            type,
            policy.covered ? policy.days : null,
          );
        } catch (error) {
          console.error(
            `Failed to resolve ${type} leave allowance:`,
            error,
          );
          allowanceByType.set(type, null);
        }
      }),
    );

    const leaveByEmployee = new Map<string, typeof leaveRequests>();
    for (const leave of leaveRequests) {
      const list = leaveByEmployee.get(leave.employeeId) ?? [];
      list.push(leave);
      leaveByEmployee.set(leave.employeeId, list);
    }

    const currentYear = Number(
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Riyadh",
        year: "numeric",
      }).format(new Date()),
    );

    const combined = [
      ...leaveRequests.map((leave) => {
        let leaveBalance: Record<string, number> | null = null;

        const allowance = allowanceByType.get(leave.type) ?? null;

        if (allowance !== null) {
          const balance = calculateLeaveBalance({
            type: leave.type,
            year: new Date(leave.startDate).getUTCFullYear(),
            allowance,
            existing: leaveByEmployee.get(leave.employeeId) ?? [],
            excludeRequestId: leave.id, // employee balance BEFORE this request
          });

          const requested = countLeaveDays(leave.startDate, leave.endDate);

          leaveBalance = {
            ...balance,
            requested,
            remainingAfter: balance.remaining - requested,
          };
        }

        return {
          id: leave.id,
          employeeId: leave.employeeId,
          requestType: "leave" as const,
          leaveType: leave.type,
          status: leave.status,
          reason: leave.reason,
          startDate: leave.startDate,
          endDate: leave.endDate,
          createdAt: leave.createdAt,
          reviewedBy: leave.reviewedBy,
          reviewedAt: leave.reviewedAt,
          leaveBalance,
        };
      }),
      ...letterRequests.map((letter) => ({
        id: letter.id,
        employeeId: letter.employeeId,
        requestType: "employment_letter" as const,
        status: letter.status,
        reason: letter.reason,
        startDate: undefined,
        leaveType: undefined,
        endDate: undefined,
        createdAt: letter.createdAt,
        reviewedBy: letter.reviewedBy,
        reviewedAt: letter.reviewedAt,
        leaveBalance: null,
      })),
    ].sort((a, b) => b.createdAt - a.createdAt);

    const uniqueEmployeeIds = Array.from(
      new Set(combined.map((item) => item.employeeId)),
    );

    const uniqueReviewerIds = Array.from(
      new Set(
        combined
          .map((item) => item.reviewedBy)
          .filter((id): id is string => Boolean(id)),
      ),
    );

    // ADDED: Load both employee and reviewer profiles.
    // The previous implementation only loaded employee IDs,
    // so reviewer names could not be resolved.
    const profileIds = Array.from(
      new Set([
        ...uniqueEmployeeIds,
        ...uniqueReviewerIds,
      ]),
    );

    let profilesById = new Map<string, string>();

    if (profileIds.length > 0) {
      const adminClient = createSupabaseAdminClient();

      const { data: profiles, error: profilesError } = await adminClient
        .from("profiles")
        .select("id, full_name, email")
        .in("id", profileIds);

      if (profilesError) {
        console.error("Failed to load employee/reviewer profiles:", profilesError);
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
      reviewedByName:
        item.reviewedBy
          ? profilesById.get(item.reviewedBy) ?? item.reviewedBy
          : null,
    }));

    // ------------------------------------------------------------------
    // Current employee balances (employee page only, ?mine=true).
    //   balances: one entry per leave type that has a policy allowance
    //   balance:  the annual one (kept for backward compatibility)
    // ------------------------------------------------------------------
    const balances: Record<string, ReturnType<typeof calculateLeaveBalance>> =
      {};

    if (mineOnly) {
      for (const [type, allowance] of allowanceByType) {
        if (allowance === null) continue;

        balances[type] = calculateLeaveBalance({
          type,
          year: currentYear,
          allowance,
          existing: leaveRequests,
        });
      }
    }

    return NextResponse.json({
      data: withNames,
      balance: balances.annual ?? null,
      balances,
    });
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
    if (error instanceof LeaveValidationError) {
      return NextResponse.json(
        { error: error.message, errors: error.errors },
        { status: 400 },
      );
    }
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