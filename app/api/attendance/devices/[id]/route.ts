import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getAttendanceContext, isUuid } from "@/src/enterprise/business/attendance/core/attendanceContext";

const DEVICE_COLUMNS =
  "id,name,vendor,model,serial_number,timezone,check_in_value,check_out_value,punch_mode,is_active,last_seen_at,updated_at";

function validTimezone(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    new Intl.DateTimeFormat("en", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_MANAGE);
    if ("error" in ctx) return ctx.error;

    const { id } = await params;
    if (!isUuid(id)) return NextResponse.json({ error: "Invalid device ID." }, { status: 400 });
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

    const updates: Record<string, unknown> = {};

    if ("name" in body) {
      if (typeof body.name !== "string" || !body.name.trim() || body.name.trim().length > 120) {
        return NextResponse.json({ error: "Invalid device name." }, { status: 400 });
      }
      updates.name = body.name.trim();
    }
    if ("timezone" in body) {
      if (!validTimezone(body.timezone)) return NextResponse.json({ error: "Invalid device timezone." }, { status: 400 });
      updates.timezone = body.timezone;
    }
    if ("isActive" in body) {
      if (typeof body.isActive !== "boolean") return NextResponse.json({ error: "isActive must be boolean." }, { status: 400 });
      updates.is_active = body.isActive;
    }
    if ("punchMode" in body) {
      if (body.punchMode !== "by_type" && body.punchMode !== "first_last") {
        return NextResponse.json({ error: "Invalid punchMode." }, { status: 400 });
      }
      updates.punch_mode = body.punchMode;
    }
    for (const [input, column] of [["checkInValue", "check_in_value"], ["checkOutValue", "check_out_value"]] as const) {
      if (input in body) {
        const value = body[input];
        if (value !== null && (typeof value !== "string" || value.length > 40)) {
          return NextResponse.json({ error: `Invalid ${input}.` }, { status: 400 });
        }
        updates[column] = typeof value === "string" && value.trim() ? value.trim() : null;
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();
    const { data: current, error: currentError } = await admin.from("attendance_devices")
      .select("check_in_value,check_out_value")
      .eq("id", id).eq("organization_id", ctx.organizationId).maybeSingle();
    if (currentError) throw new Error(currentError.message);
    if (!current) return NextResponse.json({ error: "Device not found." }, { status: 404 });

    const nextIn = "check_in_value" in updates ? updates.check_in_value : current.check_in_value;
    const nextOut = "check_out_value" in updates ? updates.check_out_value : current.check_out_value;
    if (nextIn && nextOut && nextIn === nextOut) {
      return NextResponse.json({ error: "Check-in and check-out raw values must be different." }, { status: 400 });
    }

    const { data, error } = await admin.from("attendance_devices")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id).eq("organization_id", ctx.organizationId)
      .select(DEVICE_COLUMNS)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return NextResponse.json({ error: "Device not found." }, { status: 404 });
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Attendance device update failed:", error);
    return NextResponse.json({ error: "Unable to update attendance device." }, { status: 500 });
  }
}