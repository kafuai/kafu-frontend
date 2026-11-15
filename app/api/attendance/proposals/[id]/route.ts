import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getAttendanceContext, isUuid } from "@/src/enterprise/business/attendance/core/attendanceContext";
import { PolicyManager } from "@/src/enterprise/business/policies/policyManager";
import { resolveLeavePolicyAllowance } from "@/src/enterprise/ai/agents/employeeExperience/leavePolicyAllowance";

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
    const { supabase, user, identity, organizationId } = ctx;

    const body = await request.json().catch(() => ({}));
    const action = body?.action;
    if (!["approve", "reject", "adjust", "deduct_annual_leave", "reverse_annual_leave"].includes(action)) {
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

    if (action === "reverse_annual_leave") {
      if (proposal.status !== "approved" || proposal.resolution_type !== "annual_leave") {
        return NextResponse.json({ error: "This proposal has no active annual-leave deduction to reverse." }, { status: 409 });
      }
      if (proposal.user_id === user.id) {
        return NextResponse.json({ error: "You cannot reverse your own deduction." }, { status: 403 });
      }
      if (body.confirm !== true) {
        return NextResponse.json({ error: "Confirmation is required." }, { status: 400 });
      }
      const note = typeof body.note === "string" ? body.note.trim().slice(0, 500) : null;
      const admin = createSupabaseAdminClient();
      const { data: result, error: rpcError } = await admin.rpc("reverse_attendance_absence_annual_leave", {
        p_proposal_id: id,
        p_organization_id: organizationId,
        p_actor_id: user.id,
        p_decision_note: note,
      });
      if (rpcError) return NextResponse.json({ error: rpcError.message || "Unable to reverse annual leave deduction." }, { status: 409 });
      await supabase.from("attendance_audit_log").insert({
        organization_id: organizationId,
        actor_id: user.id,
        action: "deduction.annual_leave.reverse",
        entity_type: "attendance_deduction_proposal",
        entity_id: id,
        before_data: { status: proposal.status, leave_days: proposal.leave_days },
        after_data: { status: "rejected", resolution_type: "annual_leave", reversed: true },
        note,
      });
      return NextResponse.json({ data: result, reversed: true });
    }

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

    if (action === "deduct_annual_leave") {
      if (proposal.incident_type !== "absence") {
        return NextResponse.json({ error: "Annual leave can only be deducted for a confirmed absence." }, { status: 422 });
      }
      if (body.confirm !== true) {
        return NextResponse.json({ error: "Confirmation is required." }, { status: 400 });
      }

      const policyManager = new PolicyManager(supabase);
      const allowance = await resolveLeavePolicyAllowance({
        policyManager,
        organizationId,
        companyId: identity.companyId,
        employeeId: proposal.user_id,
        leaveType: "annual",
        userMessage: "How many days of annual leave is an employee entitled to per year?",
      });

      if (!allowance.covered || allowance.days === null) {
        return NextResponse.json(
          { error: "The company's annual leave entitlement is not explicitly available in its policies. Update the policy before deducting leave." },
          { status: 422 },
        );
      }

      const leaveYear = Number(String(proposal.incident_date).slice(0, 4));
      const admin = createSupabaseAdminClient();
      const { data: appliedLeave, error: usageError } = await admin
        .from("employee_leave_usage")
        .select("used_days")
        .eq("organization_id", organizationId)
        .eq("employee_user_id", proposal.user_id)
        .eq("leave_type", "annual")
        .eq("leave_year", leaveYear);
      if (usageError) throw new Error(usageError.message);

      const usedDays = (appliedLeave ?? []).reduce((sum, row) => sum + Number(row.used_days ?? 0), 0);
      if (usedDays + 1 > allowance.days) {
        return NextResponse.json(
          { error: `Insufficient annual leave balance. Entitlement: ${allowance.days}, used: ${usedDays}, remaining: ${Math.max(allowance.days - usedDays, 0)}.` },
          { status: 422 },
        );
      }

      const { data: result, error: rpcError } = await admin.rpc("apply_attendance_absence_as_annual_leave", {
        p_proposal_id: id,
        p_organization_id: organizationId,
        p_actor_id: user.id,
        p_leave_days: 1,
        p_leave_year: leaveYear,
        p_allowance_days: allowance.days,
        p_decision_note: note,
      });
      if (rpcError) {
        const message = rpcError.message || "Unable to deduct annual leave.";
        const status = /insufficient|already|not open|only absence|self approval/i.test(message) ? 409 : 500;
        return NextResponse.json({ error: message }, { status });
      }

      await supabase.from("attendance_audit_log").insert({
        organization_id: organizationId,
        actor_id: user.id,
        action: "deduction.annual_leave.approve",
        entity_type: "attendance_deduction_proposal",
        entity_id: id,
        before_data: { status: proposal.status },
        after_data: { status: "approved", resolution_type: "annual_leave", leave_days: 1, leave_year: leaveYear },
        note,
      });

      return NextResponse.json({ data: result, resolutionType: "annual_leave", leaveDays: 1, leaveYear });
    }
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