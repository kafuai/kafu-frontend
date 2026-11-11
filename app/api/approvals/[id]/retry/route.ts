import "server-only";
import { NextResponse } from "next/server";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { approvalErrorResponse, getApprovalContext } from "@/src/enterprise/business/approvals/core/approvalContext";
import { createApprovalEngine } from "@/src/enterprise/business/approvals";
import { isUuid } from "@/src/enterprise/business/attendance/core/attendanceContext";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_req: Request, context: RouteContext) {
  try {
    const ctx = await getApprovalContext(PERMISSIONS.APPROVALS_MANAGE);
    if ("error" in ctx) return ctx.error;
    const { id } = await context.params;
    if (!isUuid(id)) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });
    const r = await createApprovalEngine(ctx.db).retryEffects(ctx.organizationId, id);
    return NextResponse.json({ data: { id: r.instance.id, effectStatus: r.effectStatus } });
  } catch (e) {
    return approvalErrorResponse(e);
  }
}