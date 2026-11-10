import "server-only";
import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";
import {processDeviceEvents} from "@/src/enterprise/business/attendance/core/deviceProcessor";

/** POST — Authorization: Bearer <device token>. يعالج بصمات هذا الجهاز فقط. */
export async function POST(request: Request) {
  try {
    const auth = request.headers.get("authorization") ?? "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
    if (!token || token.length > 200) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const tokenHash = createHash("sha256").update(token).digest("hex");

    const admin = createSupabaseAdminClient();
    const { data: device, error } = await admin.from("attendance_devices")
      .select("id,organization_id,timezone,check_in_value,check_out_value,is_active")
      .eq("token_hash", tokenHash).eq("is_active", true).maybeSingle();
    if (error) throw new Error(error.message);
    if (!device) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const result = await processDeviceEvents(admin, device, { limit: 500 });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Device sync-process failed:", error);
    return NextResponse.json({ error: "Unable to process device events." }, { status: 500 });
  }
}