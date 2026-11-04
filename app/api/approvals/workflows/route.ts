import "server-only";
import { NextResponse } from "next/server";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { approvalErrorResponse, getApprovalContext } from "@/src/enterprise/business/approvals/core/approvalContext";
import { ApprovalRepository, workflowService } from "@/src/enterprise/business/approvals";

export async function GET() {
  try {
    const ctx = await getApprovalContext(PERMISSIONS.APPROVALS_MANAGE);
    if ("error" in ctx) return ctx.error;
    const repo = new ApprovalRepository(ctx.db);
    const [data, members] = await Promise.all([repo.listWorkflows(ctx.organizationId), repo.listMembers(ctx.organizationId)]);
    return NextResponse.json({ data, members });
  } catch (e) {
    return approvalErrorResponse(e);
  }
}

/** POST { requestType, name, steps: [{ approverType, approverUserId?, approverRole?, isRequired, name? }] } -> draft */
export async function POST(request: Request) {
  try {
    const ctx = await getApprovalContext(PERMISSIONS.APPROVALS_MANAGE);
    if ("error" in ctx) return ctx.error;
    const body = await request.json().catch(() => ({}));
    const data = await workflowService.createDraft(new ApprovalRepository(ctx.db), ctx.organizationId, ctx.userId, {
      requestType: body?.requestType, name: body?.name, steps: body?.steps,
    });
    return NextResponse.json({ data }, { status: 201 });
  } catch (e) {
    return approvalErrorResponse(e);
  }
}