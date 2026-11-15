import "server-only";
import { NextResponse } from "next/server";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { approvalErrorResponse, getApprovalContext } from "@/src/enterprise/business/approvals/core/approvalContext";
import { ApprovalError, ApprovalRepository } from "@/src/enterprise/business/approvals";
import { isUuid } from "@/src/enterprise/business/attendance/core/attendanceContext";

/** PUT { userId, departmentId: string | null } — puts the employee in ONE department (null = remove). */
export async function PUT(request: Request) {
  try {
    const ctx = await getApprovalContext(PERMISSIONS.APPROVALS_MANAGE);
    if ("error" in ctx) return ctx.error;
    const { db, organizationId: org } = ctx;

    const body = await request.json().catch(() => ({}));
    const userId = body?.userId;
    const departmentId = body?.departmentId ?? null;
    if (!isUuid(userId) || (departmentId !== null && !isUuid(departmentId))) {
      throw new ApprovalError("INVALID_INPUT", "Invalid input.", 400);
    }

    const roles = await new ApprovalRepository(db).membershipRoles(org, [userId]);
    if (!roles.has(userId)) throw new ApprovalError("INVALID_USER", "The user is not a member of this company.", 422);

    if (departmentId === null) {
      const { error } = await db.from("department_members").delete().eq("organization_id", org).eq("user_id", userId);
      if (error) throw new Error(error.message);
      return NextResponse.json({ success: true });
    }

    const dep = await db.from("departments").select("id,name").eq("id", departmentId).eq("organization_id", org).maybeSingle();
    if (dep.error) throw new Error(dep.error.message);
    if (!dep.data) throw new ApprovalError("NOT_FOUND", "Department not found.", 404);

    // add to the new department first, then leave the others (never ends up in no department by accident)
    const up = await db.from("department_members").upsert(
      { organization_id: org, department_id: departmentId, user_id: userId },
      { onConflict: "department_id,user_id", ignoreDuplicates: true },
    );
    if (up.error) throw new Error(up.error.message);
    const rm = await db.from("department_members").delete()
      .eq("organization_id", org).eq("user_id", userId).neq("department_id", departmentId);
    if (rm.error) throw new Error(rm.error.message);

    // keep the text column used by payroll/attendance screens in sync (best effort)
    await db.from("payroll_employees").update({ department: dep.data.name as string })
      .eq("organization_id", org).eq("user_id", userId);

    return NextResponse.json({ success: true });
  } catch (e) {
    return approvalErrorResponse(e);
  }
}