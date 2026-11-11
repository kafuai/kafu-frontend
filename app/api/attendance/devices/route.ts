import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getAttendanceContext } from "@/src/enterprise/business/attendance/core/attendanceContext";

const DEVICE_COLUMNS =
  "id,name,vendor,model,serial_number,timezone,check_in_value,check_out_value,punch_mode,is_active,last_seen_at,created_at,updated_at";

function validTimezone(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    new Intl.DateTimeFormat("en", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_MANAGE);
    if ("error" in ctx) return ctx.error;

    let q = createSupabaseAdminClient()
      .from("attendance_devices")
      .select(DEVICE_COLUMNS)
      .eq("organization_id", ctx.organizationId)
      .order("created_at", { ascending: false });
    if (new URL(request.url).searchParams.get("activeOnly") === "1") q = q.eq("is_active", true);

    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return NextResponse.json({ data: data ?? [] });
  } catch (error) {
    console.error("Attendance devices load failed:", error);
    return NextResponse.json({ error: "Unable to load attendance devices." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_MANAGE);
    if ("error" in ctx) return ctx.error;

    const body = await request.json().catch(() => null);
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const serialNumber = typeof body?.serialNumber === "string" ? body.serialNumber.trim() : "";
    const vendor = typeof body?.vendor === "string" && body.vendor.trim() ? body.vendor.trim() : "ZKTeco";
    const model = typeof body?.model === "string" && body.model.trim() ? body.model.trim() : null;
    const timezone = body?.timezone ?? "Asia/Riyadh";
    const punchMode = body?.punchMode ?? "by_type";

    if (!name || name.length > 120) {
      return NextResponse.json({ error: "Device name is required (maximum 120 characters)." }, { status: 400 });
    }
    if (!serialNumber || serialNumber.length > 120) {
      return NextResponse.json({ error: "A valid device serial number is required." }, { status: 400 });
    }
    if (vendor.length > 80 || (model && model.length > 120)) {
      return NextResponse.json({ error: "Invalid device vendor or model." }, { status: 400 });
    }
    if (!validTimezone(timezone)) {
      return NextResponse.json({ error: "Invalid device timezone." }, { status: 400 });
    }
    if (punchMode !== "by_type" && punchMode !== "first_last") {
      return NextResponse.json({ error: "Invalid punchMode." }, { status: 400 });
    }

    // التوكن يرجع مرة وحدة فقط، ويتخزن الـ hash بس
    const apiToken = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(apiToken).digest("hex");

    const { data, error } = await createSupabaseAdminClient()
      .from("attendance_devices")
      .insert({
        organization_id: ctx.organizationId,
        name,
        vendor,
        model,
        serial_number: serialNumber,
        timezone,
        punch_mode: punchMode,
        token_hash: tokenHash,
        created_by: ctx.user.id,
      })
      .select(DEVICE_COLUMNS)
      .single();

    if (error?.code === "23505") {
      return NextResponse.json({ error: "A device with this serial number already exists in this organization." }, { status: 409 });
    }
    if (error) throw new Error(error.message);

    return NextResponse.json(
      { data, apiToken, tokenNotice: "Copy this token now. It will not be shown again." },
      { status: 201 },
    );
  } catch (error) {
    console.error("Attendance device create failed:", error);
    return NextResponse.json({ error: "Unable to create attendance device." }, { status: 500 });
  }
}