import "server-only";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getAttendanceContext, isUuid } from "@/src/enterprise/business/attendance/core/attendanceContext";

type RouteContext = { params: Promise<{ id: string }> };
const OPEN = ["needs_review", "in_review", "needs_extra_approval"];

/** PATCH { action: "approve" | "reject" | "cancel", note? } */
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!isUuid(id)) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });

    const b = await request.json().catch(() => ({}));
    const action = b?.action;
    if (!["approve", "reject", "cancel"].includes(action)) {
      return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }

    const ctx = await getAttendanceContext(
      action === "cancel" ? PERMISSIONS.ATTENDANCE_USE : PERMISSIONS.ATTENDANCE_MANAGE,
    );
    if ("error" in ctx) return ctx.error;
    const { supabase, user, organizationId } = ctx;

    const { data: c } = await supabase.from("attendance_corrections").select("*")
      .eq("id", id).eq("organization_id", organizationId).maybeSingle();
    if (!c) return NextResponse.json({ error: "Not found." }, { status: 404 });
    if (c.status !== "pending") return NextResponse.json({ error: "This request was already processed." }, { status: 409 });

    const now = new Date().toISOString();
    const note = typeof b.note === "string" ? b.note.trim().slice(0, 500) : null;

    if (action === "cancel") {
      if (c.user_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      const { data, error } = await supabase.from("attendance_corrections")
        .update({ status: "cancelled", updated_at: now })
        .eq("id", id).eq("organization_id", organizationId).eq("status", "pending")
        .select("id,status").maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) return NextResponse.json({ error: "Already processed." }, { status: 409 });
      return NextResponse.json({ data });
    }

    if (c.user_id === user.id) {
      return NextResponse.json({ error: "You cannot review your own request." }, { status: 403 });
    }

    if (action === "approve") {
      // الأحداث أولًا (idempotent عبر UNIQUE(correction_id, event_type)) ثم تغيير الحالة
      const pv = (c.proposed_value ?? {}) as { checkIn?: string | null; checkOut?: string | null };
      const events: { event_type: string; occurred_at: string }[] = [];
      if (pv.checkIn) events.push({ event_type: "check_in", occurred_at: pv.checkIn });
      if (pv.checkOut) events.push({ event_type: "check_out", occurred_at: pv.checkOut });

      for (const ev of events) {
        const { error } = await supabase.from("attendance_events").insert({
          organization_id: organizationId,
          user_id: c.user_id,
          work_date: c.work_date,
          assignment_id: c.assignment_id,
          event_type: ev.event_type,
          source: "correction",
          occurred_at: ev.occurred_at,
          geo_status: "not_required",
          idempotency_key: randomUUID(),
          correction_id: c.id,
          created_by: user.id,
        });
        if (error && error.code !== "23505") throw new Error(error.message);
      }
    }

    const { data: updated, error: upErr } = await supabase.from("attendance_corrections")
      .update({
        status: action === "approve" ? "approved" : "rejected",
        reviewed_by: user.id, reviewed_at: now, decision_note: note, updated_at: now,
      })
      .eq("id", id).eq("organization_id", organizationId).eq("status", "pending")
      .select("id,status").maybeSingle();
    if (upErr) throw new Error(upErr.message);
    if (!updated) return NextResponse.json({ error: "Already processed." }, { status: 409 });

    // قبول اعتراض/عذر: نرفض المقترحات المفتوحة المرتبطة (القرار مسجّل باسم المراجع)
    if (action === "approve" && ["dispute_late", "dispute_absence", "excuse"].includes(c.correction_type)) {
      const types = c.correction_type === "dispute_late" ? ["late"]
        : c.correction_type === "dispute_absence" ? ["absence"]
        : ["late", "early_leave", "absence"];
      await supabase.from("attendance_deduction_proposals")
        .update({
          status: "rejected", decided_by: user.id, decided_at: now,
          decision_note: `Accepted ${c.correction_type}`, updated_at: now,
        })
        .eq("organization_id", organizationId).eq("user_id", c.user_id)
        .eq("incident_date", c.work_date).in("incident_type", types).in("status", OPEN);
    }

    await supabase.from("attendance_audit_log").insert({
      organization_id: organizationId, actor_id: user.id, action: `correction.${action}`,
      entity_type: "attendance_correction", entity_id: id,
      before_data: { original: c.original_value }, after_data: { proposed: c.proposed_value, status: updated.status },
      note,
    });

    return NextResponse.json({ data: updated });
  } catch (e) {
    console.error("Correction review failed:", e);
    return NextResponse.json({ error: "Unable to process the request." }, { status: 500 });
  }
}