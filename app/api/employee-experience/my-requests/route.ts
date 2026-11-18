import "server-only";

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-auth/server";
import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";
import { resolveWorkspaceIdentity } from "@/lib/workspace-identity/tenantResolver";
import { LeaveManager } from "@/src/enterprise/business/leave";
import { EmploymentLetterManager } from "@/src/enterprise/business/employmentLetters/employmentLetterManager";
import { loadVisibleApprovals, type ApprovalView } from "@/src/enterprise/business/approvals";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const identity = await resolveWorkspaceIdentity(supabase);
    const admin = createSupabaseAdminClient();

    // All user-facing queries are scoped to the authenticated user and active organization.
    const leaveManager = new LeaveManager(supabase);
    const letterManager = new EmploymentLetterManager(supabase);
    const [leaves, letters, correctionsResult, genericResult, approvals] = await Promise.all([
      leaveManager.list(identity.organizationId, identity.userId),
      letterManager.list(identity.organizationId, identity.userId),
      supabase.from("attendance_corrections")
        .select("id,user_id,organization_id,status,correction_type,work_date,reason,decision_note,created_at,reviewed_by,reviewed_at")
        .eq("organization_id", identity.organizationId)
        .eq("user_id", identity.userId)
        .order("created_at", { ascending: false }),
      supabase.from("employee_requests")
        .select("id,request_type,status,title,description,request_data,response_data,created_at,reviewed_by,reviewed_at")
        .eq("organization_id", identity.organizationId)
        .eq("user_id", identity.userId)
        .order("created_at", { ascending: false }),
      loadVisibleApprovals(admin, identity.organizationId, identity.userId, false, true),
    ]);

    if (correctionsResult.error) throw new Error(correctionsResult.error.message);
    if (genericResult.error) throw new Error(genericResult.error.message);

    const correctionRows = correctionsResult.data ?? [];
    const approvalIds = [
      ...leaves.map((r) => `leave:${r.id}`),
      ...correctionRows.map((r) => `attendance_correction:${r.id}`),
    ];
    const approvalBySubject = new Map<string, ApprovalView>();
    for (const key of approvalIds) {
      const view = approvals.views.get(key);
      if (view) approvalBySubject.set(key, view);
    }

    const otherRequests = (genericResult.data ?? []).filter(
      (r) => r.request_type !== "leave" && r.request_type !== "employment_letter",
    );

    const rows = [
      ...leaves.map((r) => ({
        id: r.id,
        requestType: "leave",
        title: "طلب إجازة",
        status: r.status,
        description: r.reason,
        createdAt: r.createdAt,
        startDate: r.startDate,
        endDate: r.endDate,
        leaveType: r.type,
        approval: approvalBySubject.get(`leave:${r.id}`) ?? null,
        reviewedBy: r.reviewedBy,
        reviewedAt: r.reviewedAt,
      })),
      ...letters.map((r) => ({
        id: r.id,
        requestType: "employment_letter",
        title: "طلب خطاب تعريف",
        status: r.status,
        description: r.reason,
        createdAt: r.createdAt,
        approval: null,
        reviewedBy: r.reviewedBy,
        reviewedAt: r.reviewedAt,
      })),
      ...correctionRows.map((r) => ({
        id: r.id,
        requestType: "attendance_correction",
        title: "طلب تصحيح حضور",
        status: r.status,
        description: r.reason,
        createdAt: new Date(r.created_at).getTime(),
        workDate: r.work_date,
        correctionType: r.correction_type,
        decisionNote: r.decision_note,
        approval: approvalBySubject.get(`attendance_correction:${r.id}`) ?? null,
        reviewedBy: r.reviewed_by,
        reviewedAt: r.reviewed_at ? new Date(r.reviewed_at).getTime() : null,
      })),
      ...otherRequests.map((r) => ({
        id: r.id,
        requestType: r.request_type,
        title: r.title || (r.request_type === "inquiry" ? "استفسار" : "طلب تحديث بيانات"),
        status: r.status,
        description: r.description || "",
        requestData: r.request_data,
        responseData: r.response_data,
        createdAt: new Date(r.created_at).getTime(),
        approval: null,
        reviewedBy: r.reviewed_by,
        reviewedAt: r.reviewed_at ? new Date(r.reviewed_at).getTime() : null,
      })),
    ].sort((a, b) => Number(b.createdAt) - Number(a.createdAt));

    const reviewerIds = [...new Set(rows.map((r) => r.reviewedBy).filter(Boolean) as string[])];
    const reviewerNames = new Map<string, string>();
    if (reviewerIds.length) {
      const { data, error } = await admin.from("profiles").select("id,full_name,email")
        .in("id", reviewerIds);
      if (error) throw new Error(`Unable to load reviewer names: ${error.message}`);
      for (const profile of data ?? []) {
        reviewerNames.set(profile.id, profile.full_name?.trim() || profile.email || profile.id);
      }
    }

    return NextResponse.json({
      data: rows.map((r) => ({
        ...r,
        reviewedByName: r.reviewedBy ? reviewerNames.get(r.reviewedBy) ?? null : null,
      })),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("My requests load failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load your requests." },
      { status: 500 },
    );
  }
}
