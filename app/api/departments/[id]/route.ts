import "server-only";
import { NextResponse } from "next/server";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { approvalErrorResponse, getApprovalContext } from "@/src/enterprise/business/approvals/core/approvalContext";
import { ApprovalError } from "@/src/enterprise/business/approvals";
import { isUuid } from "@/src/enterprise/business/attendance/core/attendanceContext";

type RouteContext = { params: Promise<{ id: string }> };

/** PATCH { name } */
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const ctx = await getApprovalContext(PERMISSIONS.APPROVALS_MANAGE);
    if ("error" in ctx) return ctx.error;
    const { id } = await context.params;
    if (!isUuid(id)) throw new ApprovalError("INVALID_ID", "Invalid ID.", 400);
    const body = await request.json().catch(() => ({}));
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    if (!name || name.length > 80) throw new ApprovalError("INVALID_NAME", "Department name (1–80 chars) is required.", 400);

    const { data, error } = await ctx.db.from("departments").update({ name })
      .eq("id", id).eq("organization_id", ctx.organizationId).select("id,name").maybeSingle();
    if (error) {
      if (error.code === "23505") throw new ApprovalError("DUPLICATE", "A department with this name already exists.", 409);
      throw new Error(error.message);
    }
    if (!data) throw new ApprovalError("NOT_FOUND", "Department not found.", 404);
    return NextResponse.json({ data });
  } catch (e) {
    return approvalErrorResponse(e);
  }
}

/** Deleting a department removes its memberships/heads. Open approvals keep their frozen approvers. */
export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const ctx = await getApprovalContext(PERMISSIONS.APPROVALS_MANAGE);
    if ("error" in ctx) return ctx.error;
    const { id } = await context.params;
    if (!isUuid(id)) throw new ApprovalError("INVALID_ID", "Invalid ID.", 400);
    const { error } = await ctx.db.from("departments").delete().eq("id", id).eq("organization_id", ctx.organizationId);
    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true });
  } catch (e) {
    return approvalErrorResponse(e);
  }
}