import "server-only";
import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase-auth/server";
import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";
import { resolveWorkspaceIdentity } from "@/lib/workspace-identity/tenantResolver";
import { hasPermission } from "@/lib/rbac/authorization";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { ApprovalRepository } from "@/src/enterprise/business/approvals";
import { LeaveManager, toDateKey } from "@/src/enterprise/business/leave";
import {
  LEAVE_ATTACHMENT_BUCKET,
  createLeaveAttachmentSignedUrl,
} from "@/src/enterprise/business/leave/utils/leaveAttachment";

const LEAVE_LABELS: Record<string, string> = {
  annual: "Annual Leave",
  sick: "Sick Leave",
  emergency: "Emergency Leave",
  unpaid: "Unpaid Leave",
  maternity: "Maternity Leave",
  other: "Leave",
};

// Strip characters that are unsafe in file names / headers.
const safeName = (s: string) =>
  s
    .replace(/[\\/:*?"<>|%\u0000-\u001f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export async function GET(request: Request) {
  try {
    const parts = new URL(request.url).pathname.split("/").filter(Boolean);
    const idx = parts.lastIndexOf("attachment");
    const id = idx > 0 ? parts[idx - 1] : "";
    if (!id) {
      return NextResponse.json({ error: "A leave request ID is required." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const identity = await resolveWorkspaceIdentity(supabase);

    const ref = await new LeaveManager(supabase).getAttachmentRef(id, identity.organizationId);
    if (
      !ref?.attachment ||
      ref.attachment.bucket !== LEAVE_ATTACHMENT_BUCKET ||
      !ref.attachment.path.startsWith(`${ref.companyId}/`)
    ) {
      return NextResponse.json({ error: "Attachment not found." }, { status: 404 });
    }

    const isOwner = ref.employeeId === identity.userId;
    const role = identity.role ?? "";
    const canViewAllRequests = hasPermission(role, PERMISSIONS.REQUESTS_VIEW_ALL);

    // A non-owner may open an attachment only if they have organization-wide request
    // visibility or are included in at least one step of this request's frozen workflow.
    let isWorkflowApprover = false;
    if (!isOwner && !canViewAllRequests) {
      const admin = createSupabaseAdminClient();
      const instance = await new ApprovalRepository(admin).getInstanceBySubject(
        identity.organizationId,
        "leave",
        id,
      );
      isWorkflowApprover = Boolean(
        instance?.steps_snapshot.some((step) => step.approverIds.includes(identity.userId)),
      );
    }

    if (!isOwner && !canViewAllRequests && !isWorkflowApprover) {
      return NextResponse.json(
        { error: "You do not have permission to view this attachment." },
        { status: 403 },
      );
    }

    // Employee who uploaded the file (the request owner).
    const { data: profile } = await createSupabaseAdminClient()
      .from("profiles")
      .select("full_name,email")
      .eq("id", ref.employeeId)
      .maybeSingle();

    const employeeName =
      safeName(profile?.full_name ?? "") ||
      safeName(profile?.email ?? "") ||
      "Employee";

    const start = toDateKey(ref.startDate);
    const end = toDateKey(ref.endDate);
    const dates = start === end ? start : `${start} to ${end}`;

    const ext = ref.attachment.path.split(".").pop() ?? "pdf";
    const label = LEAVE_LABELS[ref.leaveType] ?? LEAVE_LABELS.other;

    // e.g. "Sultan Ayesh - Sick Leave - 2026-10-09 to 2026-10-10.pdf"
    const downloadName = `${employeeName} - ${label} - ${dates}.${ext}`;

    const url = await createLeaveAttachmentSignedUrl(ref.attachment.path, downloadName);

    return NextResponse.json(
      { data: { url, fileName: downloadName, mimeType: ref.attachment.mimeType } },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Leave attachment access failed:", error);
    return NextResponse.json({ error: "Unable to open attachment." }, { status: 500 });
  }
}