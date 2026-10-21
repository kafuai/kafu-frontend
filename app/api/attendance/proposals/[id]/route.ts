import "server-only";
import { NextResponse } from "next/server";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getAttendanceContext, isUuid } from "@/src/enterprise/business/attendance/core/attendanceContext";

type RouteContext = { params: Promise<{ id: string }> };

const OPEN_STATUSES = ["needs_review", "in_review", "needs_extra_approval", "apply_failed"];

const parseAmount = (v: unknown): number | null => {
  if (typeof v !== "number" || !Number.isFinite(v) || v <= 0) return null;
  return Math.round(v * 100) === v * 100 ? v : null;
};

/**
 * PATCH { action: "approve" | "reject" | "adjust", amount?, reason?, note?, confirm? }
 */
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!isUuid(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_DEDUCTIONS_REVIEW);
    if ("error" in ctx) return ctx.error;
    const { supabase, user, organizationId } = ctx;

    const body = await request.json().catch(() => ({}));
    const action = body?.action;
    if (!["approve", "reject", "adjust"].includes(action)) {
      return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }

    const { data: proposal, error } = await supabase
      .from("attendance_deduction_proposals")
      .select("*")
      .eq("id", id)
      .eq("organization_id", organizationId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!proposal) return NextResponse.json({ error: "Not found." }, { status: 404 });

    if (!OPEN_STATUSES.includes(proposal.status)) {
      return NextResponse.json({ error: "This proposal was already decided." }, { status: 409 });
    }

    const { data: applied } = await supabase
      .from("attendance_deduction_applications")
      .select("id").eq("proposal_id", id).maybeSingle();
    if (applied) {
      return NextResponse.json({ error: "Already included in a payroll run." }, { status: 409 });
    }

    // لا اعتماد ذاتي
    if (proposal.user_id === user.id) {
      await supabase
        .from("attendance_deduction_proposals")
        .update({ status: "needs_extra_approval", updated_at: new Date().toISOString() })
        .eq("id", id).eq("organization_id", organizationId)
        .in("status", OPEN_STATUSES);
      return NextResponse.json(
        { error: "You cannot decide on your own deduction. Another owner must approve it." },
        { status: 403 },
      );
    }

    const reason = typeof body.reason === "string" ? body.reason.trim() : "";
    const note = typeof body.note === "string" ? body.note.trim().slice(0, 500) : null;
    const now = new Date().toISOString();
    const patch: Record<string, unknown> = {
      decided_by: user.id, decided_at: now, decision_note: note, updated_at: now,
    };

    if (action === "reject") {
      patch.status = "rejected";
    } else if (action === "approve") {
      const amount = parseAmount(Number(proposal.original_amount));
      if (amount === null) {
        return NextResponse.json(
          { error: "No calculated amount. Use 'adjust' with an amount and a reason." },
          { status: 422 },
        );
      }
      patch.status = "approved";
      patch.final_amount = amount;
    } else {
      const amount = parseAmount(body.amount);
      if (amount === null) {
        return NextResponse.json({ error: "Invalid amount." }, { status: 400 });
      }
      if (reason.length < 3) {
        return NextResponse.json({ error: "An adjustment reason is required." }, { status: 400 });
      }
      if (body.confirm !== true) {
        return NextResponse.json({ error: "Final confirmation is required." }, { status: 400 });
      }
      patch.status = "approved";
      patch.final_amount = amount;
      patch.adjustment_reason = reason;
    }

    const { data: updated, error: upErr } = await supabase
      .from("attendance_deduction_proposals")
      .update(patch)
      .eq("id", id)
      .eq("organization_id", organizationId)
      .in("status", OPEN_STATUSES)          // حماية من قرارين متزامنين
      .select("id,status,original_amount,final_amount")
      .maybeSingle();

    if (upErr) {
      if (upErr.code === "23514") {
        return NextResponse.json({ error: "Decision violates deduction rules." }, { status: 422 });
      }
      throw new Error(upErr.message);
    }
    if (!updated) {
      return NextResponse.json({ error: "This proposal was already decided." }, { status: 409 });
    }

    await supabase.from("attendance_audit_log").insert({
      organization_id: organizationId,
      actor_id: user.id,
      action: `deduction.${action}`,
      entity_type: "attendance_deduction_proposal",
      entity_id: id,
      before_data: { status: proposal.status, original_amount: proposal.original_amount },
      after_data: { status: updated.status, final_amount: updated.final_amount },
      note: reason || note,
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("Deduction decision failed:", error);
    return NextResponse.json({ error: "Unable to save the decision." }, { status: 500 });
  }
}