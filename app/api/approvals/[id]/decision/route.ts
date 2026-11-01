import "server-only";
import { NextResponse } from "next/server";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { approvalErrorResponse, getApprovalContext } from "@/src/enterprise/business/approvals/core/approvalContext";
import { createApprovalEngine } from "@/src/enterprise/business/approvals";
import { isUuid } from "@/src/enterprise/business/attendance/core/attendanceContext";

type RouteContext = { params: Promise<{ id: string }> };

/** POST { decision: "approved" | "rejected", note? } — approver identity comes from the session only. */
export async function POST(request: Request, context: RouteContext) {
  try {
    const ctx = await getApprovalContext(PERMISSIONS.APPROVALS_MANAGE);
    if ("error" in ctx) return ctx.error;
    const { id } = await context.params;
    if (!isUuid(id)) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });

    const body = await request.json().catch(() => ({}));
    if (body?.decision !== "approved" && body?.decision !== "rejected") {
      return NextResponse.json({ error: "Invalid decision." }, { status: 400 });
    }
    const result = await createApprovalEngine(ctx.db).decide({
      organizationId: ctx.organizationId, instanceId: id, actorId: ctx.userId,
      decision: body.decision, note: typeof body.note === "string" ? body.note : null,
    });
    // 202 = decision saved, but applying the business effect failed (HR can retry).
    return NextResponse.json(
      { data: { id: result.instance.id, status: result.instance.status, currentStep: result.instance.current_step_order, effectStatus: result.effectStatus } },
      { status: result.effectStatus === "failed" ? 202 : 200 },
    );
  } catch (e) {
    return approvalErrorResponse(e);
  }
}