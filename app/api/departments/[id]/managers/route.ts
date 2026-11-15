import "server-only";
import { NextResponse } from "next/server";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { approvalErrorResponse, getApprovalContext } from "@/src/enterprise/business/approvals/core/approvalContext";
import { ApprovalError, ApprovalRepository } from "@/src/enterprise/business/approvals";
import { isUuid } from "@/src/enterprise/business/attendance/core/attendanceContext";

type RouteContext = { params: Promise<{ id: string }> };

/** PUT { userIds: string[] } — replaces the set of heads of this department. */
export async function PUT(request: Request, context: RouteContext) {
  try {
    const ctx = await getApprovalContext(PERMISSIONS.APPROVALS_MANAGE);
    if ("error" in ctx) return ctx.error;
    const { db, organizationId: org } = ctx;
    const { id } = await context.params;
    if (!isUuid(id)) throw new ApprovalError("INVALID_ID", "Invalid ID.", 400);

    const body = await request.json().catch(() => ({}));
    const raw: unknown[] = Array.isArray(body?.userIds) ? body.userIds : [];
    const userIds = [...new Set(raw)] as string[];
    if (userIds.length > 20 || !userIds.every(isUuid)) {
      throw new ApprovalError("INVALID_USERS", "Invalid users.", 400);
    }

    const dep = await db.from("departments").select("id").eq("id", id).eq("organization_id", org).maybeSingle();
    if (dep.error) throw new Error(dep.error.message);
    if (!dep.data) throw new ApprovalError("NOT_FOUND", "Department not found.", 404);

    // Heads must be members of THIS company with role owner/manager.
    const roles = await new ApprovalRepository(db).membershipRoles(org, userIds);
    if (userIds.some((u) => !["owner", "manager"].includes(roles.get(u) ?? ""))) {
      throw new ApprovalError("INVALID_HEAD", "A department head must be a manager or owner of this company.", 422);
    }

    if (userIds.length) {
      const { error } = await db.from("department_managers").upsert(
        userIds.map((u) => ({ organization_id: org, department_id: id, user_id: u })),
        { onConflict: "department_id,user_id", ignoreDuplicates: true },
      );
      if (error) throw new Error(error.message);
    }
    let del = db.from("department_managers").delete().eq("organization_id", org).eq("department_id", id);
    if (userIds.length) del = del.not("user_id", "in", `(${userIds.join(",")})`); // uuids already validated
    const { error: delError } = await del;
    if (delError) throw new Error(delError.message);

    return NextResponse.json({ success: true });
  } catch (e) {
    return approvalErrorResponse(e);
  }
}