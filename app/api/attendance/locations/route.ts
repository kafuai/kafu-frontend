import "server-only";
import { NextResponse } from "next/server";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getAttendanceContext, isUuid } from "@/src/enterprise/business/attendance/core/attendanceContext";

const validTz = (tz: unknown) => {
  if (typeof tz !== "string") return false;
  try { new Intl.DateTimeFormat("en", { timeZone: tz }); return true; } catch { return false; }
};
const optNum = (v: unknown) => (v === null || v === undefined || v === "" ? null : Number(v));

function parse(body: any, partial: boolean): { error: string } | { out: Record<string, unknown> } {
  const out: Record<string, unknown> = {};
  if (!partial || "name" in body) {
    const n = typeof body.name === "string" ? body.name.trim() : "";
    if (!n || n.length > 120) return { error: "Invalid name." };
    out.name = n;
  }
  if (!partial || "timezone" in body) {
    const tz = body.timezone ?? "Asia/Riyadh";
    if (!validTz(tz)) return { error: "Invalid timezone." };
    out.timezone = tz;
  }
  for (const [k, col] of [["latitude", "latitude"], ["longitude", "longitude"], ["radiusM", "geofence_radius_m"]] as const) {
    if (!partial || k in body) {
      const v = optNum(body[k]);
      if (v !== null && (!Number.isFinite(v) || (k === "radiusM" && !Number.isInteger(v)))) {
        return { error: `Invalid ${k}.` };
      }
      out[col] = v;
    }
  }
  for (const [k, col] of [["geofenceRequired", "geofence_required"], ["remoteAllowed", "remote_allowed"], ["isActive", "is_active"]] as const) {
    if (k in body) out[col] = body[k] === true;
  }
  return { out };
}

const dbError = (e: { code?: string; message: string }) =>
  e.code === "23505" ? NextResponse.json({ error: "A location with this name already exists." }, { status: 409 })
  : e.code === "23514" ? NextResponse.json({ error: "Invalid location settings (coordinates, radius or geofence)." }, { status: 400 })
  : null;

const REQUIRED_LABELS: Record<string, string> = {
  name: "name",
  timezone: "timezone",
  latitude: "latitude",
  longitude: "longitude",
  geofence_radius_m: "radius",
};

/** الحقول الناقصة (null أو فارغ) من كائن موقع */
function missingFields(o: Record<string, unknown>): string[] {
  return Object.keys(REQUIRED_LABELS).filter((k) => {
    const v = o[k];
    return v === null || v === undefined || (typeof v === "string" && v.trim() === "");
  });
}

export async function GET() {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_USE);
    if ("error" in ctx) return ctx.error;
    const { data, error } = await ctx.supabase.from("work_locations").select("*")
      .eq("organization_id", ctx.organizationId).order("name");
    if (error) throw new Error(error.message);
    return NextResponse.json({ data });
  } catch (e) {
    console.error("Locations load failed:", e);
    return NextResponse.json({ error: "Unable to load locations." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_MANAGE);
    if ("error" in ctx) return ctx.error;
    const body = await request.json().catch(() => ({}));
    const parsed = parse(body, false);
    if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

    const missing = missingFields(parsed.out);
    if (missing.length > 0) {
      return NextResponse.json(
        {
          error: `Complete all location data before saving. Missing: ${missing.map((k) => REQUIRED_LABELS[k]).join(", ")}.`,
          fields: missing,
        },
        { status: 400 },
      );
    }

    const { data, error } = await ctx.supabase.from("work_locations")
      .insert({ ...parsed.out, organization_id: ctx.organizationId, created_by: ctx.user.id })
      .select("*").single();
    if (error) return dbError(error) ?? Promise.reject(new Error(error.message));
    return NextResponse.json({ data }, { status: 201 });
  } catch (e) {
    console.error("Location create failed:", e);
    return NextResponse.json({ error: "Unable to create location." }, { status: 500 });
  }
}

/** PATCH { id, ...الحقول } */
export async function PATCH(request: Request) {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_MANAGE);
    if ("error" in ctx) return ctx.error;
    const body = await request.json().catch(() => ({}));
    if (!isUuid(body.id)) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });

    const parsed = parse(body, true);
    if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
    if (Object.keys(parsed.out).length === 0) return NextResponse.json({ error: "Nothing to update." }, { status: 400 });

        // الموقع الفعّال (بعد التعديل) يجب أن تكون بياناته كاملة
    const { data: current } = await ctx.supabase.from("work_locations").select("*")
      .eq("id", body.id).eq("organization_id", ctx.organizationId).maybeSingle();
    if (!current) return NextResponse.json({ error: "Not found." }, { status: 404 });

    const merged = { ...current, ...parsed.out } as Record<string, unknown>;
    const missing = missingFields(merged);
    if (merged.is_active === true && missing.length > 0) {
      return NextResponse.json(
        {
          error: `Complete the location data before enabling it. Missing: ${missing.map((k) => REQUIRED_LABELS[k]).join(", ")}.`,
          fields: missing,
        },
        { status: 400 },
      );
    }

    // تغيير المنطقة الزمنية يغيّر حساب السجلات التاريخية
    if ("timezone" in parsed.out) {
      const { count } = await ctx.supabase.from("attendance_days")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", ctx.organizationId).eq("location_id", body.id);
      if ((count ?? 0) > 0) {
        return NextResponse.json({ error: "Timezone cannot be changed for a location with attendance history. Create a new location." }, { status: 409 });
      }
    }

    const { data, error } = await ctx.supabase.from("work_locations")
      .update({ ...parsed.out, updated_at: new Date().toISOString() })
      .eq("id", body.id).eq("organization_id", ctx.organizationId)
      .select("*").maybeSingle();
    if (error) return dbError(error) ?? Promise.reject(new Error(error.message));
    if (!data) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ data });
  } catch (e) {
    console.error("Location update failed:", e);
    return NextResponse.json({ error: "Unable to update location." }, { status: 500 });
  }
}