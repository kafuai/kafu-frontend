import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";
import { hasPermission } from "@/lib/rbac/authorization";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getAttendanceContext } from "@/src/enterprise/business/attendance/core/attendanceContext";
import { addDays, dateKeyInTz, isDateKey, zonedTimeToUtc } from "@/src/enterprise/business/attendance/utils/time";
import { DEFAULT_TZ } from "@/src/enterprise/business/attendance/utils/schedule";
import { loadScheduleForDate } from "@/src/enterprise/business/attendance/core/shiftResolver";
import { pickEffectiveEvents } from "@/src/enterprise/business/attendance/core/attendanceEvaluator";

const TYPES = ["missed_check_in", "missed_check_out", "time_change", "dispute_late", "dispute_absence", "excuse"];

export async function GET(request: Request) {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_USE);
    if ("error" in ctx) return ctx.error;
    const { supabase, user, identity, organizationId } = ctx;
    const canManage = hasPermission(identity.role ?? "", PERMISSIONS.ATTENDANCE_MANAGE);
    const status = new URL(request.url).searchParams.get("status");

    let q = supabase.from("attendance_corrections").select("*")
      .eq("organization_id", organizationId).order("created_at", { ascending: false }).limit(300);
    if (!canManage) q = q.eq("user_id", user.id);
    if (status) q = q.eq("status", status);

    const { data, error } = await q;
    if (error) throw new Error(error.message);
    const rows = data ?? [];

    const ids = [...new Set(rows.flatMap((r) => [r.user_id, r.reviewed_by]).filter(Boolean) as string[])];
    const names = new Map<string, string>();
    if (ids.length) {
      const { data: profs } = await createSupabaseAdminClient().from("profiles").select("id,full_name,email").in("id", ids);
      for (const p of profs ?? []) names.set(p.id, p.full_name?.trim() || p.email || p.id);
    }

    return NextResponse.json({
      canManage,
      data: rows.map((r) => ({
        ...r, userName: names.get(r.user_id) ?? r.user_id,
        reviewedByName: r.reviewed_by ? names.get(r.reviewed_by) ?? null : null,
      })),
    });
  } catch (e) {
    console.error("Corrections load failed:", e);
    return NextResponse.json({ error: "Unable to load correction requests." }, { status: 500 });
  }
}

/**
 * POST { workDate, correctionType, reason,
 *        proposedCheckIn?: {date,time}, proposedCheckOut?: {date,time} }
 */
export async function POST(request: Request) {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_USE);
    if ("error" in ctx) return ctx.error;
    const { supabase, user, organizationId } = ctx;

    const b = await request.json().catch(() => ({}));
    const today = dateKeyInTz(Date.now(), DEFAULT_TZ);
    const reason = typeof b.reason === "string" ? b.reason.trim() : "";

    if (!TYPES.includes(b.correctionType)) return NextResponse.json({ error: "Invalid correction type." }, { status: 400 });
    if (!isDateKey(b.workDate) || b.workDate > today || b.workDate < addDays(today, -31)) {
      return NextResponse.json({ error: "The date must be within the last 31 days." }, { status: 400 });
    }
    if (reason.length < 3 || reason.length > 1000) {
      return NextResponse.json({ error: "A reason is required (3–1000 characters)." }, { status: 400 });
    }

    const cand = await loadScheduleForDate(supabase, organizationId, user.id, b.workDate);
    if (!cand) return NextResponse.json({ error: "You have no scheduled shift on this date." }, { status: 400 });
    const s = cand.schedule;

    const { data: evs } = await supabase.from("attendance_events")
      .select("event_type,source,occurred_at,created_at")
      .eq("organization_id", organizationId).eq("user_id", user.id)
      .gte("occurred_at", new Date(s.start - s.earlyCheckinMinutes * 60_000).toISOString())
      .lte("occurred_at", new Date(s.end + 6 * 3_600_000).toISOString());
    const orig = pickEffectiveEvents((evs ?? []) as any, s);

    const toMs = (v: any): number | null | "bad" => {
      if (v == null) return null;
      if (!isDateKey(v.date) || typeof v.time !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(v.time)) return "bad";
      return zonedTimeToUtc(v.date, v.time, s.timezone);
    };
    const pIn = toMs(b.proposedCheckIn);
    const pOut = toMs(b.proposedCheckOut);
    if (pIn === "bad" || pOut === "bad") return NextResponse.json({ error: "Invalid proposed time." }, { status: 400 });

    const needsTime = ["missed_check_in", "missed_check_out", "time_change"].includes(b.correctionType);
    if (needsTime) {
      if (b.correctionType === "missed_check_in" && (pIn === null || pOut !== null)) return NextResponse.json({ error: "Provide the check-in time." }, { status: 400 });
      if (b.correctionType === "missed_check_out" && (pOut === null || pIn !== null)) return NextResponse.json({ error: "Provide the check-out time." }, { status: 400 });
      if (b.correctionType === "time_change" && pIn === null && pOut === null) return NextResponse.json({ error: "Provide at least one time." }, { status: 400 });
      if (b.correctionType === "missed_check_in" && orig.checkIn !== null) return NextResponse.json({ error: "A check-in already exists. Use 'time change'." }, { status: 409 });
      if (b.correctionType === "missed_check_out" && orig.checkOut !== null) return NextResponse.json({ error: "A check-out already exists. Use 'time change'." }, { status: 409 });

      const lo = s.start - 12 * 3_600_000, hi = s.end + 12 * 3_600_000;
      for (const t of [pIn, pOut]) {
        if (t !== null && (t < lo || t > hi)) return NextResponse.json({ error: "The proposed time is too far from the shift." }, { status: 400 });
      }
      const finalIn = (pIn as number | null) ?? orig.checkIn;
      const finalOut = (pOut as number | null) ?? orig.checkOut;
      if (finalIn !== null && finalOut !== null && finalOut <= finalIn) {
        return NextResponse.json({ error: "Check-out must be after check-in." }, { status: 400 });
      }
    }

    const iso = (n: number | null | undefined) => (n ? new Date(n).toISOString() : null);
    const { data, error } = await supabase.from("attendance_corrections")
      .insert({
        organization_id: organizationId,
        user_id: user.id,
        work_date: b.workDate,
        assignment_id: cand.assignment.id,
        correction_type: b.correctionType,
        original_value: { checkIn: iso(orig.checkIn), checkOut: iso(orig.checkOut) },
        proposed_value: needsTime ? { checkIn: iso(pIn as number | null), checkOut: iso(pOut as number | null) } : {},
        reason,
        requested_by: user.id,
        status: "pending",
      })
      .select("id,status").single();

    if (error) {
      if (error.code === "23505") return NextResponse.json({ error: "You already have a pending request of this type for this date." }, { status: 409 });
      throw new Error(error.message);
    }

    await supabase.from("attendance_audit_log").insert({
      organization_id: organizationId, actor_id: user.id, action: "correction.create",
      entity_type: "attendance_correction", entity_id: data.id,
      after_data: { type: b.correctionType, workDate: b.workDate },
    });
    return NextResponse.json({ data }, { status: 201 });
  } catch (e) {
    console.error("Correction create failed:", e);
    return NextResponse.json({ error: "Unable to submit the request." }, { status: 500 });
  }
}