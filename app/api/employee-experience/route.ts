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

import { hasPermission } from "@/lib/rbac/authorization";
import { PERMISSIONS } from "@/lib/rbac/permissions";

import {
  createApprovalEngine,
  loadVisibleApprovals,
  type ApprovalView,
} from "@/src/enterprise/business/approvals";

type CombinedItem = {
  id: string;
  employeeId: string;
  requestType: "leave" | "employment_letter" | "attendance_correction";
  status: string;
  reason: string;
  createdAt: number;
  reviewedBy: string | null;
  reviewedAt: number | null;
  startDate?: number;
  endDate?: number;
  leaveType?: string;
  correctionType?: string;
  workDate?: string;
  leaveBalance: Record<string, number> | null;
  approval: ApprovalView | null;
  canDecide: boolean;
};

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const identity = await resolveWorkspaceIdentity(supabase);

    const url = new URL(request.url);
    const mineOnly = url.searchParams.get("mine") === "true";

    const role = identity.role ?? "";

    // Organization-wide visibility is deliberately separate from workflow participation
    // and from permission to manage workflow configuration.
    const canViewAllRequests = hasPermission(role, PERMISSIONS.REQUESTS_VIEW_ALL);
    const canViewRequests =
      hasPermission(role, PERMISSIONS.REQUESTS_VIEW) ||
      canViewAllRequests ||
      hasPermission(role, PERMISSIONS.APPROVALS_VIEW);

    // Employees may always read their own requests. The shared inbox requires a view permission.
    if (!mineOnly && !canViewRequests) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Only workflow administrators handle legacy requests that have no active workflow.
    const canManage = hasPermission(role, PERMISSIONS.APPROVALS_MANAGE);
    // Employment letters currently have no workflow; keep them restricted to request managers.
    const canManageLetters = hasPermission(role, PERMISSIONS.REQUESTS_MANAGE);

    const adminClient = createSupabaseAdminClient();

    // Non-mine view lists other employees' rows, so it is filtered below in code (explicit org scope).
    const leaveManager = new LeaveManager(mineOnly ? supabase : adminClient);
    const employmentLetterManager = new EmploymentLetterManager(supabase);

    const employeeIdFilter = mineOnly ? identity.userId : undefined;

    const [allLeave, allLetters] = await Promise.all([
      leaveManager.list(identity.organizationId, employeeIdFilter),
      employmentLetterManager.list(identity.organizationId, employeeIdFilter),
    ]);

    // Organization-wide viewers see all workflow instances. Everyone else sees only
    // requests connected to a step assigned to their user in the workflow snapshot.
    const approvals = mineOnly
      ? null
      : await loadVisibleApprovals(
          adminClient,
          identity.organizationId,
          identity.userId,
          canViewAllRequests,
        );

    const leaveRequests = mineOnly || canViewAllRequests
      ? allLeave
      : allLeave.filter((l) => approvals?.views.has(`leave:${l.id}`));

    // Employment letters have no approval workflow yet, so they remain owner/admin-only
    // in the organization inbox and personal-only for employees.
    const letterRequests = mineOnly || canManageLetters ? allLetters : [];

    // Attendance corrections/disputes are listed here only when they run through a workflow.
    type CorrectionRow = {
      id: string; user_id: string; status: string; correction_type: string; work_date: string;
      reason: string; created_at: string; reviewed_by: string | null; reviewed_at: string | null;
    };
    let correctionRows: CorrectionRow[] = [];
    const correctionIds = approvals
      ? approvals.instances.filter((i) => i.subject_type === "attendance_correction").map((i) => i.request_id)
      : [];
    if (correctionIds.length > 0) {
      const { data, error } = await adminClient
        .from("attendance_corrections")
        .select("id,user_id,status,correction_type,work_date,reason,created_at,reviewed_by,reviewed_at")
        .eq("organization_id", identity.organizationId)
        .in("id", correctionIds);
      if (error) throw new Error(`Unable to load correction requests: ${error.message}`);
      correctionRows = (data ?? []) as CorrectionRow[];
    }

    // ------------------------------------------------------------------
    // Allowance per leave type (from the company policy text).
    // An AI failure only hides the balance, it never breaks the page.
    // ------------------------------------------------------------------
    const policyManager = new PolicyManager(supabase);

    const typesToResolve = new Set<LeaveType>(leaveRequests.map((leave) => leave.type));
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
          allowanceByType.set(type, policy.covered ? policy.days : null);
        } catch (error) {
          console.error(`Failed to resolve ${type} leave allowance:`, error);
          allowanceByType.set(type, null);
        }
      }),
    );

    // Balances use ALL leave of each employee (not only the visible ones).
    const leaveByEmployee = new Map<string, typeof allLeave>();
    for (const leave of allLeave) {
      const list = leaveByEmployee.get(leave.employeeId) ?? [];
      list.push(leave);
      leaveByEmployee.set(leave.employeeId, list);
    }

    const currentYear = Number(
      new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Riyadh", year: "numeric" }).format(new Date()),
    );

    const viewOf = (kind: "leave" | "attendance_correction", id: string): ApprovalView | null =>
      approvals?.views.get(`${kind}:${id}`) ?? null;

    const combined: CombinedItem[] = [
      ...leaveRequests.map((leave): CombinedItem => {
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
          leaveBalance = { ...balance, requested, remainingAfter: balance.remaining - requested };
        }

        const approval = viewOf("leave", leave.id);
        return {
          id: leave.id,
          employeeId: leave.employeeId,
          requestType: "leave",
          leaveType: leave.type,
          status: leave.status,
          reason: leave.reason,
          startDate: leave.startDate,
          endDate: leave.endDate,
          createdAt: leave.createdAt,
          reviewedBy: leave.reviewedBy,
          reviewedAt: leave.reviewedAt,
          leaveBalance,
          approval,
          // workflow => only the current approver; no workflow => HR/owner (legacy direct approval)
          canDecide: approval
            ? approval.canDecide
            : !mineOnly && canManage && leave.status === "pending",
        };
      }),
      ...letterRequests.map((letter): CombinedItem => ({
        id: letter.id,
        employeeId: letter.employeeId,
        requestType: "employment_letter",
        status: letter.status,
        reason: letter.reason,
        createdAt: letter.createdAt,
        reviewedBy: letter.reviewedBy,
        reviewedAt: letter.reviewedAt,
        leaveBalance: null,
        approval: null,
        canDecide: !mineOnly && canManageLetters && letter.status === "pending",
      })),
      ...correctionRows.map((c): CombinedItem => {
        const approval = viewOf("attendance_correction", c.id);
        return {
          id: c.id,
          employeeId: c.user_id,
          requestType: "attendance_correction",
          status: c.status,
          reason: c.reason,
          correctionType: c.correction_type,
          workDate: c.work_date,
          createdAt: new Date(c.created_at).getTime(),
          reviewedBy: c.reviewed_by,
          reviewedAt: c.reviewed_at ? new Date(c.reviewed_at).getTime() : null,
          leaveBalance: null,
          approval,
          canDecide: approval ? approval.canDecide : false,
        };
      }),
    ].sort((a, b) => b.createdAt - a.createdAt);

    const profileIds = Array.from(
      new Set([
        ...combined.map((item) => item.employeeId),
        ...combined.map((item) => item.reviewedBy).filter((id): id is string => Boolean(id)),
      ]),
    );

    let profilesById = new Map<string, string>();

    if (profileIds.length > 0) {
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
      employeeName: profilesById.get(item.employeeId) ?? item.employeeId,
      reviewedByName: item.reviewedBy ? profilesById.get(item.reviewedBy) ?? item.reviewedBy : null,
    }));

    // Current employee balances (employee page only, ?mine=true).
    const balances: Record<string, ReturnType<typeof calculateLeaveBalance>> = {};

    if (mineOnly) {
      for (const [type, allowance] of allowanceByType) {
        if (allowance === null) continue;
        balances[type] = calculateLeaveBalance({
          type,
          year: currentYear,
          allowance,
          existing: allLeave,
        });
      }
    }

    return NextResponse.json({
      data: withNames,
      balance: balances.annual ?? null,
      balances,
      canManage,
    });
  } catch (error) {
    console.error("Employee Experience requests fetch failed:", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load employee requests." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const identity = await resolveWorkspaceIdentity(supabase);

    const body = await request.json();

    const message = typeof body.message === "string" ? body.message.trim() : "";
    const locale = typeof body.locale === "string" ? body.locale : undefined;

    if (!message) {
      return NextResponse.json({ error: "A message is required." }, { status: 400 });
    }

    const profile = createEmployeeExperienceAgentProfile(identity.organizationId);

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

    // Start the company's approval workflow for the new leave request (if one is active).
    // No active workflow => null => the request stays on the direct HR approval path.
    if (result.type === "leave_request" && result.requestId) {
      try {
        await createApprovalEngine(createSupabaseAdminClient()).start(
          identity.organizationId,
          "leave",
          result.requestId,
        );
      } catch (approvalError) {
        // The request itself is saved; it simply stays on the direct HR path if the workflow can't start.
        console.error("Approval workflow could not start for leave request:", result.requestId, approvalError);
      }
    }

    return NextResponse.json({
      data: result,
      agent: { id: profile.id, name: profile.name, status: profile.status },
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
      { error: error instanceof Error ? error.message : "Agent execution failed." },
      { status: 500 },
    );
  }
}