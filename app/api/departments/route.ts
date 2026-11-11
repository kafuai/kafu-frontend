import "server-only";
import { NextResponse } from "next/server";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { approvalErrorResponse, getApprovalContext } from "@/src/enterprise/business/approvals/core/approvalContext";
import { ApprovalError, ApprovalRepository } from "@/src/enterprise/business/approvals";

export async function GET() {
  try {
    const ctx = await getApprovalContext(PERMISSIONS.APPROVALS_MANAGE);
    if ("error" in ctx) return ctx.error;
    const { db, organizationId: org } = ctx;

    const [d, m, g] = await Promise.all([
      db.from("departments").select("id,name").eq("organization_id", org).order("name"),
      db.from("department_members").select("department_id,user_id").eq("organization_id", org),
      db.from("department_managers").select("department_id,user_id").eq("organization_id", org),
    ]);
    for (const r of [d, m, g]) if (r.error) throw new Error(r.error.message);

    const people = await new ApprovalRepository(db).listMembers(org);
    const nameOf = new Map(people.map((p) => [p.userId, p.name]));
    const who = (userId: string) => ({ userId, name: nameOf.get(userId) ?? userId });

    const assignments: Record<string, string> = {}; // userId -> departmentId
    for (const r of m.data ?? []) assignments[r.user_id as string] = r.department_id as string;

    const data = (d.data ?? []).map((dep) => ({
      id: dep.id as string,
      name: dep.name as string,
      managers: (g.data ?? []).filter((x) => x.department_id === dep.id).map((x) => who(x.user_id as string)),
      members: (m.data ?? []).filter((x) => x.department_id === dep.id).map((x) => who(x.user_id as string)),
    }));

    // Only owner/manager roles can be department heads (members cannot open the requests page).
    const candidates = people.filter((p) => ["owner", "manager"].includes(p.role.toLowerCase()));

    return NextResponse.json({ data, assignments, candidates });
  } catch (e) {
    return approvalErrorResponse(e);
  }
}

/** POST { name } */
export async function POST(request: Request) {
  try {
    const ctx = await getApprovalContext(PERMISSIONS.APPROVALS_MANAGE);
    if ("error" in ctx) return ctx.error;
    const body = await request.json().catch(() => ({}));
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    if (!name || name.length > 80) throw new ApprovalError("INVALID_NAME", "Department name (1–80 chars) is required.", 400);

    const { data, error } = await ctx.db.from("departments")
      .insert({ organization_id: ctx.organizationId, name }).select("id,name").single();
    if (error) {
      if (error.code === "23505") throw new ApprovalError("DUPLICATE", "A department with this name already exists.", 409);
      throw new Error(error.message);
    }
    return NextResponse.json({ data }, { status: 201 });
  } catch (e) {
    return approvalErrorResponse(e);
  }
}