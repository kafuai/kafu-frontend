import "server-only";
import { NextResponse } from "next/server";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getAttendanceContext, isUuid } from "@/src/enterprise/business/attendance/core/attendanceContext";

const hhmm = (v: unknown) => typeof v === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
const int = (v: unknown, min: number, max: number) =>
  typeof v === "number" && Number.isInteger(v) && v >= min && v <= max;

function parse(body: any, partial: boolean): { error: string } | { out: Record<string, any> } {
  const out: Record<string, any> = {};
  if (!partial || "name" in body) {
    const n = typeof body.name === "string" ? body.name.trim() : "";
    if (!n || n.length > 120) return { error: "Invalid name." };
    out.name = n;
  }
  if (!partial || "startTime" in body) {
    if (!hhmm(body.startTime)) return { error: "Invalid start time." };
    out.start_time = `${body.startTime}:00`;
  }
  if (!partial || "endTime" in body) {
    if (!hhmm(body.endTime)) return { error: "Invalid end time." };
    out.end_time = `${body.endTime}:00`;
  }
  if (!partial || "workDays" in body) {
    const d = body.workDays;
    if (!Array.isArray(d) || d.length < 1 || d.length > 7 || !d.every((x) => int(x, 0, 6)) || new Set(d).size !== d.length) {
      return { error: "Invalid work days." };
    }
    out.work_days = [...d].sort();
  }
  const nums: [string, string, number, number, number][] = [
    ["graceMinutes", "grace_minutes", 0, 240, 0],
    ["breakMinutes", "break_minutes", 0, 480, 0],
    ["earlyCheckinMinutes", "early_checkin_minutes", 0, 600, 120],
  ];
  for (const [k, col, min, max, def] of nums) {
    if (!partial || k in body) {
      const v = body[k] ?? def;
      if (!int(v, min, max)) return { error: `Invalid ${k}.` };
      out[col] = v;
    }
  }
  if ("locationId" in body) {
    if (body.locationId !== null && !isUuid(body.locationId)) return { error: "Invalid location." };
    out.location_id = body.locationId;
  }
  if ("isActive" in body) out.is_active = body.isActive === true;
  return { out };
}

export async function GET() {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_USE);
    if ("error" in ctx) return ctx.error;
    const { data, error } = await ctx.supabase.from("shifts").select("*")
      .eq("organization_id", ctx.organizationId).order("name");
    if (error) throw new Error(error.message);
    return NextResponse.json({ data });
  } catch (e) {
    console.error("Shifts load failed:", e);
    return NextResponse.json({ error: "Unable to load shifts." }, { status: 500 });
  }
}

const dbErr = (e: { code?: string }) =>
  e.code === "23505" ? NextResponse.json({ error: "A shift with this name already exists." }, { status: 409 })
  : e.code === "23503" ? NextResponse.json({ error: "Invalid work location." }, { status: 400 })
  : e.code === "23514" ? NextResponse.json({ error: "Invalid shift settings." }, { status: 400 })
  : null;

export async function POST(request: Request) {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_MANAGE);
    if ("error" in ctx) return ctx.error;
    const body = await request.json().catch(() => ({}));
    const parsed = parse(body, false);
    if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

    const o = parsed.out;
    const { data, error } = await ctx.supabase.from("shifts")
      .insert({
        ...o,
        location_id: o.location_id ?? null,
        crosses_midnight: o.end_time < o.start_time,
        organization_id: ctx.organizationId,
        created_by: ctx.user.id,
      })
      .select("*").single();
    if (error) return dbErr(error) ?? Promise.reject(new Error(error.message));
    return NextResponse.json({ data }, { status: 201 });
  } catch (e) {
    console.error("Shift create failed:", e);
    return NextResponse.json({ error: "Unable to create shift." }, { status: 500 });
  }
}

/** PATCH { id, ... }  — الأوقات وأيام العمل والسماح لا تتغير بعد وجود سجلات */
export async function PATCH(request: Request) {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_MANAGE);
    if ("error" in ctx) return ctx.error;
    const body = await request.json().catch(() => ({}));
    if (!isUuid(body.id)) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });

    const parsed = parse(body, true);
    if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const o = parsed.out;
    if (Object.keys(o).length === 0) return NextResponse.json({ error: "Nothing to update." }, { status: 400 });

    const scheduleKeys = ["start_time", "end_time", "work_days", "grace_minutes", "break_minutes", "early_checkin_minutes", "location_id"];
    if (scheduleKeys.some((k) => k in o)) {
      const [days, events] = await Promise.all([
        ctx.supabase.from("attendance_days").select("id", { count: "exact", head: true })
          .eq("organization_id", ctx.organizationId).eq("shift_id", body.id),
        ctx.supabase.from("attendance_events").select("id", { count: "exact", head: true })
          .eq("organization_id", ctx.organizationId).eq("shift_id", body.id),
      ]);
      if ((days.count ?? 0) + (events.count ?? 0) > 0) {
        return NextResponse.json(
          { error: "This shift already has attendance history. Create a new shift and assign it from a future date." },
          { status: 409 },
        );
      }
      if ("start_time" in o || "end_time" in o) {
        const { data: cur } = await ctx.supabase.from("shifts").select("start_time,end_time")
          .eq("id", body.id).eq("organization_id", ctx.organizationId).maybeSingle();
        if (!cur) return NextResponse.json({ error: "Not found." }, { status: 404 });
        const s = (o.start_time ?? cur.start_time) as string;
        const e = (o.end_time ?? cur.end_time) as string;
        o.crosses_midnight = e < s;
      }
    }

    const { data, error } = await ctx.supabase.from("shifts")
      .update({ ...o, updated_at: new Date().toISOString() })
      .eq("id", body.id).eq("organization_id", ctx.organizationId)
      .select("*").maybeSingle();
    if (error) return dbErr(error) ?? Promise.reject(new Error(error.message));
    if (!data) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ data });
  } catch (e) {
    console.error("Shift update failed:", e);
    return NextResponse.json({ error: "Unable to update shift." }, { status: 500 });
  }
}