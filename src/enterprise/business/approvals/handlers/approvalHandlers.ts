import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ApprovalError, type WorkflowRequestType } from "../types/approvalTypes";
import type { ApprovalHandler, HandlerContext, SubjectInfo } from "../core/approvalEngine";

const DISPUTE_TYPES = ["dispute_late", "dispute_absence", "excuse"];
const OPEN_PROPOSALS = ["needs_review", "in_review", "needs_extra_approval"];

/* ---------------- Leave (employee_requests, request_type='leave') ---------------- */
async function setLeaveStatus(ctx: HandlerContext, status: "approved" | "rejected") {
  const { db, organizationId: org, instance } = ctx;
  const now = new Date().toISOString();
  const patch: Record<string, unknown> = { status, reviewed_by: ctx.finalApproverId, reviewed_at: now, updated_at: now };
  if (status === "rejected") patch.response_data = ctx.note ? { reason: ctx.note } : {};

  // Conditional on status='pending': can never overwrite a different final state.
  const { data, error } = await db.from("employee_requests").update(patch)
    .eq("id", instance.request_id).eq("organization_id", org).eq("request_type", "leave").eq("status", "pending")
    .select("id").maybeSingle();
  if (error) throw new Error(`leave update failed: ${error.message}`);
  if (data) return;

  const { data: cur } = await db.from("employee_requests").select("status")
    .eq("id", instance.request_id).eq("organization_id", org).maybeSingle();
  if (cur?.status === status) return; // idempotent retry
  throw new ApprovalError("SUBJECT_STATE_CONFLICT", "The leave request is no longer pending.", 409);
}

export const leaveHandler: ApprovalHandler = {
  async describe(db: SupabaseClient, org: string, id: string): Promise<SubjectInfo | null> {
    const { data, error } = await db.from("employee_requests")
      .select("id,user_id,status,description,request_data")
      .eq("id", id).eq("organization_id", org).eq("request_type", "leave").maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    const rd = (data.request_data ?? {}) as Record<string, unknown>;
    return {
      requesterId: data.user_id as string, workflowType: "leave", status: data.status as string,
      summary: {
        leaveType: rd.leave_type ?? "other", startDate: rd.start_date ?? null, endDate: rd.end_date ?? null,
        reason: (rd.reason as string) ?? data.description ?? "",
      },
    };
  },
  onApproved: (ctx) => setLeaveStatus(ctx, "approved"),
  onRejected: (ctx) => setLeaveStatus(ctx, "rejected"),
};

/* ---------------- Attendance correction + disputes (attendance_corrections) ---------------- */
const correctionWorkflowType = (t: string): WorkflowRequestType =>
  DISPUTE_TYPES.includes(t) ? "attendance_dispute" : "attendance_correction";

export const correctionHandler: ApprovalHandler = {
  async describe(db, org, id) {
    const { data, error } = await db.from("attendance_corrections")
      .select("id,user_id,status,correction_type,work_date,reason,original_value,proposed_value")
      .eq("id", id).eq("organization_id", org).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    return {
      requesterId: data.user_id as string,
      workflowType: correctionWorkflowType(data.correction_type as string),
      status: data.status as string,
      summary: {
        correctionType: data.correction_type, workDate: data.work_date, reason: data.reason,
        original: data.original_value ?? {}, proposed: data.proposed_value ?? {},
      },
    };
  },

  async onApproved(ctx) {
    const { db, organizationId: org, instance } = ctx;
    const { data: c, error } = await db.from("attendance_corrections").select("*")
      .eq("id", instance.request_id).eq("organization_id", org).maybeSingle();
    if (error) throw new Error(error.message);
    if (!c) throw new ApprovalError("NOT_FOUND", "Correction not found.", 404);
    if (c.status === "approved") return; // idempotent
    if (c.status !== "pending") throw new ApprovalError("SUBJECT_STATE_CONFLICT", "The request is no longer pending.", 409);

    const now = new Date().toISOString();
    const pv = (c.proposed_value ?? {}) as { checkIn?: string | null; checkOut?: string | null };
    const events: { event_type: string; occurred_at: string }[] = [];
    if (pv.checkIn) events.push({ event_type: "check_in", occurred_at: pv.checkIn });
    if (pv.checkOut) events.push({ event_type: "check_out", occurred_at: pv.checkOut });

    // Events first; UNIQUE(correction_id, event_type) makes a retry safe (23505 ignored).
    for (const ev of events) {
      const { error: e } = await db.from("attendance_events").insert({
        organization_id: org, user_id: c.user_id, work_date: c.work_date, assignment_id: c.assignment_id,
        event_type: ev.event_type, source: "correction", occurred_at: ev.occurred_at, geo_status: "not_required",
        idempotency_key: randomUUID(), correction_id: c.id, created_by: ctx.finalApproverId,
      });
      if (e && e.code !== "23505") throw new Error(e.message);
    }

    const { data: updated, error: upErr } = await db.from("attendance_corrections").update({
      status: "approved", reviewed_by: ctx.finalApproverId, reviewed_at: now, decision_note: ctx.note, updated_at: now,
    }).eq("id", c.id).eq("organization_id", org).eq("status", "pending").select("id").maybeSingle();
    if (upErr) throw new Error(upErr.message);
    if (!updated) return;

    if (DISPUTE_TYPES.includes(c.correction_type)) {
      const types = c.correction_type === "dispute_late" ? ["late"]
        : c.correction_type === "dispute_absence" ? ["absence"] : ["late", "early_leave", "absence"];
      await db.from("attendance_deduction_proposals").update({
        status: "rejected", decided_by: ctx.finalApproverId, decided_at: now,
        decision_note: `Accepted ${c.correction_type}`, updated_at: now,
      }).eq("organization_id", org).eq("user_id", c.user_id).eq("incident_date", c.work_date)
        .in("incident_type", types).in("status", OPEN_PROPOSALS);
    }

    await db.from("attendance_audit_log").insert({
      organization_id: org, actor_id: ctx.finalApproverId, action: "correction.approve",
      entity_type: "attendance_correction", entity_id: c.id,
      before_data: { original: c.original_value }, after_data: { proposed: c.proposed_value, via: "approval_workflow" },
      note: ctx.note,
    });
  },

  async onRejected(ctx) {
    const { db, organizationId: org, instance } = ctx;
    const now = new Date().toISOString();
    const { data, error } = await db.from("attendance_corrections").update({
      status: "rejected", reviewed_by: ctx.finalApproverId, reviewed_at: now, decision_note: ctx.note, updated_at: now,
    }).eq("id", instance.request_id).eq("organization_id", org).eq("status", "pending").select("id").maybeSingle();
    if (error) throw new Error(error.message);
    if (data) {
      await db.from("attendance_audit_log").insert({
        organization_id: org, actor_id: ctx.finalApproverId, action: "correction.reject",
        entity_type: "attendance_correction", entity_id: instance.request_id,
        after_data: { via: "approval_workflow" }, note: ctx.note,
      });
      return;
    }
    const { data: cur } = await db.from("attendance_corrections").select("status")
      .eq("id", instance.request_id).eq("organization_id", org).maybeSingle();
    if (cur?.status !== "rejected") {
      throw new ApprovalError("SUBJECT_STATE_CONFLICT", "The request is no longer pending.", 409);
    }
  },
};