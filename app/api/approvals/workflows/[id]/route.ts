import "server-only";
import { NextResponse } from "next/server";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { approvalErrorResponse, getApprovalContext } from "@/src/enterprise/business/approvals/core/approvalContext";
import { ApprovalRepository, workflowService } from "@/src/enterprise/business/approvals";
import { isUuid } from "@/src/enterprise/business/attendance/core/attendanceContext";

type RouteContext = { params: Promise<{ id: string }> };

async function base(context: RouteContext) {
  const ctx = await getApprovalContext(PERMISSIONS.APPROVALS_MANAGE);
  if ("error" in ctx) return { error: ctx.error };
  const { id } = await context.params;
  if (!isUuid(id)) return { error: NextResponse.json({ error: "Invalid ID." }, { status: 400 }) };
  return { ctx, id, repo: new ApprovalRepository(ctx.db) };
}

/** PUT { name?, steps? } — drafts only */
export async function PUT(request: Request, context: RouteContext) {
  try {
    const b = await base(context);
    if ("error" in b) return b.error;
    const body = await request.json().catch(() => ({}));
    const data = await workflowService.updateDraft(b.repo, b.ctx.organizationId, b.id, { name: body?.name, steps: body?.steps });
    return NextResponse.json({ data });
  } catch (e) {
    return approvalErrorResponse(e);
  }
}

/** POST { action: "activate" | "deactivate" | "clone" } */
export async function POST(request: Request, context: RouteContext) {
  try {
    const b = await base(context);
    if ("error" in b) return b.error;
    const { organizationId, userId } = b.ctx;
    const action = (await request.json().catch(() => ({})))?.action;
    if (action === "activate") return NextResponse.json({ data: await workflowService.activate(b.repo, organizationId, b.id) });
    if (action === "deactivate") return NextResponse.json({ data: await workflowService.deactivate(b.repo, organizationId, b.id) });
    if (action === "clone") {
      return NextResponse.json({ data: await workflowService.cloneAsDraft(b.repo, organizationId, userId, b.id) }, { status: 201 });
    }
    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (e) {
    return approvalErrorResponse(e);
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const b = await base(context);
    if ("error" in b) return b.error;
    await workflowService.deleteDraft(b.repo, b.ctx.organizationId, b.id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return approvalErrorResponse(e);
  }
}