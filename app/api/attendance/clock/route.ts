import "server-only";
import { NextResponse } from "next/server";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getAttendanceContext, isUuid } from "@/src/enterprise/business/attendance/core/attendanceContext";
import {
  addDays, dateKeyInTz,
} from "@/src/enterprise/business/attendance/utils/time";
import {
  buildSchedule, DEFAULT_TZ, CHECKOUT_GRACE_MINUTES,
  type AssignmentRow, type LocationRow, type ShiftRow,
} from "@/src/enterprise/business/attendance/utils/schedule";
import { verifyGeo } from "@/src/enterprise/business/attendance/utils/geo";
import { LeaveManager, toDateKey } from "@/src/enterprise/business/leave";


const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : undefined);

const REASONS = {
  no_active_shift: {
    ar: "لا توجد وردية فعالة لك الآن.",
    en: "You have no active shift right now.",
  },
  already_checked_in: {
    ar: "تم تسجيل حضورك لهذه الفترة مسبقًا.",
    en: "You have already checked in for this shift.",
  },
  already_checked_out: {
    ar: "تم تسجيل انصرافك لهذه الفترة مسبقًا.",
    en: "You have already checked out for this shift.",
  },
  not_checked_in: {
    ar: "لا يمكن تسجيل الانصراف قبل تسجيل الحضور.",
    en: "You cannot check out before checking in.",
  },
  location_unavailable: {
    ar: "تعذر تحديد موقعك. فعّل إذن الموقع وأعد المحاولة.",
    en: "Your location is unavailable. Enable location permission and retry.",
  },
  outside_geofence: {
    ar: "أنت خارج النطاق الجغرافي المسموح به لموقع العمل.",
    en: "You are outside the allowed work location area.",
  },
    on_leave: {
    ar: "لديك إجازة معتمدة في هذا اليوم.",
    en: "You have an approved leave on this day.",
  },
    checkout_window_closed: {
    ar: "انتهت مهلة تسجيل الانصراف لهذه الوردية. قدّم طلب تصحيح (نسيت تسجيل الانصراف).",
    en: "The check-out window for this shift has closed. Submit a correction request (forgot to check out).",
  },
} as const;

export async function POST(request: Request) {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_USE);
    if ("error" in ctx) return ctx.error;
    const { supabase, user, organizationId } = ctx;

    const body = await request.json().catch(() => null);
    const lang: "ar" | "en" = body?.locale === "ar" ? "ar" : "en";
    const fail = (code: keyof typeof REASONS, status: number, extra?: object) =>
      NextResponse.json({ error: REASONS[code][lang], code, ...extra }, { status });

    const eventType = body?.eventType;
    if (eventType !== "check_in" && eventType !== "check_out") {
      return NextResponse.json({ error: "Invalid eventType" }, { status: 400 });
    }
    if (!isUuid(body?.idempotencyKey)) {
      return NextResponse.json({ error: "Invalid idempotencyKey" }, { status: 400 });
    }
    const idempotencyKey: string = body.idempotencyKey;

    // إعادة إرسال نفس الطلب: نرجع السجل الأول دون إنشاء مكرر
    const { data: prior } = await supabase
      .from("attendance_events")
      .select("id,event_type,occurred_at,work_date")
      .eq("organization_id", organizationId)
      .eq("user_id", user.id)
      .eq("idempotency_key", idempotencyKey)
      .maybeSingle();
    if (prior) return NextResponse.json({ event: prior, duplicate: true });

    const now = Date.now();
    const probeFrom = dateKeyInTz(now, DEFAULT_TZ);

    const { data: assignments, error: aErr } = await supabase
      .from("shift_assignments")
      .select("id,user_id,shift_id,location_id,effective_from,effective_to")
      .eq("organization_id", organizationId)
      .eq("user_id", user.id)
      .lte("effective_from", addDays(probeFrom, 1))
      .or(`effective_to.is.null,effective_to.gte.${addDays(probeFrom, -1)}`);
    if (aErr) throw new Error(aErr.message);
    if (!assignments?.length) return fail("no_active_shift", 409);

    const shiftIds = [...new Set(assignments.map((a) => a.shift_id))];
    const { data: shifts } = await supabase
      .from("shifts").select("*").eq("organization_id", organizationId).in("id", shiftIds);
    const shiftById = new Map((shifts ?? []).map((s) => [s.id, s as ShiftRow]));

    const locIds = [
      ...new Set([
        ...assignments.map((a) => a.location_id),
        ...(shifts ?? []).map((s) => s.location_id),
      ].filter(Boolean) as string[]),
    ];
    const { data: locs } = locIds.length
      ? await supabase.from("work_locations").select("*").eq("organization_id", organizationId).in("id", locIds)
      : { data: [] as LocationRow[] };
    const locById = new Map((locs ?? []).map((l) => [l.id, l as LocationRow]));

        const MIN = 60_000;
    const GRACE = CHECKOUT_GRACE_MINUTES * MIN;

    type Cand = {
      a: AssignmentRow; shift: ShiftRow; loc: LocationRow | null;
      s: NonNullable<ReturnType<typeof buildSchedule>>;
    };

    // كل الفترات (أمس واليوم) التي بدأت نافذة حضورها
    const all: Cand[] = [];
    for (const a of assignments as AssignmentRow[]) {
      const shift = shiftById.get(a.shift_id);
      if (!shift) continue;
      const loc = locById.get(a.location_id ?? shift.location_id ?? "") ?? null;
      const today = dateKeyInTz(now, loc?.timezone || DEFAULT_TZ);

      for (const d of [addDays(today, -1), today]) {
        const s = buildSchedule(a, shift, loc, d);
        if (s && now >= s.start - s.earlyCheckinMinutes * MIN) all.push({ a, shift, loc, s });
      }
    }

    // أحداث هذه الفترات (أي مصدر، بما فيها التصحيحات المعتمدة)
    const dates = [...new Set(all.map((c) => c.s.workDate))];
    const { data: evs } = dates.length
      ? await supabase.from("attendance_events").select("event_type,work_date")
          .eq("organization_id", organizationId).eq("user_id", user.id).in("work_date", dates)
      : { data: [] as { event_type: string; work_date: string }[] };
    const has = (c: Cand, t: string) =>
      (evs ?? []).some((e) => e.work_date === c.s.workDate && e.event_type === t);

    const inStrict = (c: Cand) =>
      now >= c.s.start - c.s.earlyCheckinMinutes * MIN && now <= c.s.end;
    const inCheckout = (c: Cand) => now >= c.s.start && now <= c.s.end + GRACE;

    let active: Cand | null = null;

    if (eventType === "check_in") {
      // الحضور: داخل وقت الوردية فقط
      active = all.filter(inStrict)
        .sort((x, y) => Math.abs(now - x.s.start) - Math.abs(now - y.s.start))[0] ?? null;
      if (!active) return fail("no_active_shift", 409);
      if (has(active, "check_in")) return fail("already_checked_in", 409);
      if (active.loc && !active.loc.is_active) return fail("no_active_shift", 409);

      const act = active;
      const leaves = await new LeaveManager(supabase).list(organizationId, user.id);
      const onLeave = leaves.some(
        (l) =>
          l.status === "approved" &&
          toDateKey(l.startDate) <= act.s.workDate &&
          toDateKey(l.endDate) >= act.s.workDate,
      );
      if (onLeave) return fail("on_leave", 409);
    } else {
      
      active = all
        .filter((c) => inCheckout(c) && has(c, "check_in") && !has(c, "check_out"))
        .sort((x, y) => y.s.start - x.s.start)[0] ?? null;

      if (!active) {
        if (all.some((c) => inCheckout(c) && has(c, "check_out"))) return fail("already_checked_out", 409);
        if (all.some((c) => now > c.s.end + GRACE && has(c, "check_in") && !has(c, "check_out"))) {
          return fail("checkout_window_closed", 409);
        }
        if (all.some(inStrict)) return fail("not_checked_in", 409);
        return fail("no_active_shift", 409);
      }
    }

    const geo = verifyGeo(active.loc, {
      latitude: num(body?.latitude),
      longitude: num(body?.longitude),
      accuracy: num(body?.accuracy),
    });
    if (!geo.ok) return fail(geo.code, 403, { distance: geo.distance });

    const { data: inserted, error: insErr } = await supabase
      .from("attendance_events")
      .insert({
        organization_id: organizationId,
        user_id: user.id,
        assignment_id: active.a.id,
        shift_id: active.shift.id,
        location_id: active.loc?.id ?? null,
        work_date: active.s.workDate,
        event_type: eventType,
        source: body?.source === "mobile" ? "mobile" : "web",
        scheduled_start: new Date(active.s.start).toISOString(),
        scheduled_end: new Date(active.s.end).toISOString(),
        latitude: num(body?.latitude) ?? null,
        longitude: num(body?.longitude) ?? null,
        accuracy_m: num(body?.accuracy) ?? null,
        distance_m: geo.distance,
        geo_status: geo.geoStatus,
        client_meta: { userAgent: request.headers.get("user-agent")?.slice(0, 300) ?? null },
        idempotency_key: idempotencyKey,
        created_by: user.id,
      })
      .select("id,event_type,occurred_at,work_date")
      .single();

    if (insErr) {
      if (insErr.code === "23505") {
        const { data: again } = await supabase
          .from("attendance_events")
          .select("id,event_type,occurred_at,work_date")
          .eq("organization_id", organizationId)
          .eq("user_id", user.id)
          .eq("idempotency_key", idempotencyKey)
          .maybeSingle();
        if (again) return NextResponse.json({ event: again, duplicate: true });
        return fail(eventType === "check_in" ? "already_checked_in" : "already_checked_out", 409);
      }
      throw new Error(insErr.message);
    }

    return NextResponse.json({ event: inserted }, { status: 201 });
  } catch (error) {
    console.error("Attendance clock failed:", error);
    return NextResponse.json({ error: "Unable to record attendance." }, { status: 500 });
  }
}