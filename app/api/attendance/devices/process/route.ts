import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getAttendanceContext, isUuid } from "@/src/enterprise/business/attendance/core/attendanceContext";
import { processDeviceEvents } from "@/src/enterprise/business/attendance/core/deviceProcessor";

/** POST { deviceId, limit?, dryRun? } — بجلسة المدير */
export async function POST(request: Request) {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_MANAGE);
    if ("error" in ctx) return ctx.error;

    const body = await request.json().catch(() => null);
    if (!isUuid(body?.deviceId)) return NextResponse.json({ error: "Invalid device ID." }, { status: 400 });
    const limit = Number(body?.limit ?? 100);
    if (!Number.isInteger(limit) || limit < 1 || limit > 500) {
      return NextResponse.json({ error: "Limit must be between 1 and 500." }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();
    const { data: device, error } = await admin.from("attendance_devices")
      .select("id,organization_id,timezone,check_in_value,check_out_value,is_active")
      .eq("id", body.deviceId).eq("organization_id", ctx.organizationId).maybeSingle();
    if (error) throw new Error(error.message);
    if (!device) return NextResponse.json({ error: "Device not found." }, { status: 404 });
    if (!device.is_active) return NextResponse.json({ error: "Device is inactive." }, { status: 409 });

    const result = await processDeviceEvents(admin, device, { limit, dryRun: body?.dryRun === true });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Attendance device event processing failed:", error);
    return NextResponse.json({ error: "Unable to process device attendance events." }, { status: 500 });
  }
}