import "server-only";
import { NextResponse } from "next/server";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getAttendanceContext } from "@/src/enterprise/business/attendance/core/attendanceContext";
import { dateKeyInTz, isDateKey } from "@/src/enterprise/business/attendance/utils/time";
import { DEFAULT_TZ } from "@/src/enterprise/business/attendance/utils/schedule";

export async function GET() {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_DEDUCTIONS_REVIEW);
    if ("error" in ctx) return ctx.error;
    const { data, error } = await ctx.supabase.from("attendance_deduction_policies").select("*")
      .eq("organization_id", ctx.organizationId).eq("is_active", true);
    if (error) throw new Error(error.message);
    return NextResponse.json({ data });
  } catch (e) {
    console.error("Policies load failed:", e);
    return NextResponse.json({ error: "Unable to load policies." }, { status: 500 });
  }
}

/** PUT { incidentType, method, value, wageBasis, minMinutes, maxAmount?, effectiveFrom } */
export async function PUT(request: Request) {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_DEDUCTIONS_REVIEW);
    if ("error" in ctx) return ctx.error;
    const { supabase, user, organizationId } = ctx;

    const b = await request.json().catch(() => ({}));
    const today = dateKeyInTz(Date.now(), DEFAULT_TZ);

    if (!["late", "early_leave", "absence"].includes(b.incidentType)) return NextResponse.json({ error: "Invalid incident type." }, { status: 400 });
    if (!["fixed_amount", "percent_of_daily_wage", "per_minute_of_daily_wage"].includes(b.method)) return NextResponse.json({ error: "Invalid method." }, { status: 400 });
    if (!["basic", "basic_plus_housing", "gross"].includes(b.wageBasis)) return NextResponse.json({ error: "Invalid wage basis." }, { status: 400 });
    if (typeof b.value !== "number" || !Number.isFinite(b.value) || b.value < 0) return NextResponse.json({ error: "Invalid value." }, { status: 400 });
    if (b.method === "percent_of_daily_wage" && b.value > 100) return NextResponse.json({ error: "Percent cannot exceed 100." }, { status: 400 });
    if (!Number.isInteger(b.minMinutes) || b.minMinutes < 0) return NextResponse.json({ error: "Invalid minimum minutes." }, { status: 400 });
    if (b.maxAmount != null && (typeof b.maxAmount !== "number" || b.maxAmount < 0)) return NextResponse.json({ error: "Invalid maximum amount." }, { status: 400 });
    const effectiveFrom = isDateKey(b.effectiveFrom) ? b.effectiveFrom : today;

    const { data: old } = await supabase.from("attendance_deduction_policies").select("id")
      .eq("organization_id", organizationId).eq("incident_type", b.incidentType).eq("is_active", true).maybeSingle();

    if (old) {
      const { error } = await supabase.from("attendance_deduction_policies")
        .update({ is_active: false, effective_to: today }).eq("id", old.id).eq("organization_id", organizationId);
      if (error) throw new Error(error.message);
    }

    const { data, error } = await supabase.from("attendance_deduction_policies")
      .insert({
        organization_id: organizationId, incident_type: b.incidentType, method: b.method,
        value: b.value, wage_basis: b.wageBasis, min_minutes: b.minMinutes,
        max_amount: b.maxAmount ?? null, is_active: true, effective_from: effectiveFrom,
        approved_by: user.id,
      })
      .select("*").single();

    if (error) {
      // استرجاع السياسة السابقة كي لا يبقى النوع بلا سياسة
      if (old) await supabase.from("attendance_deduction_policies")
        .update({ is_active: true, effective_to: null }).eq("id", old.id).eq("organization_id", organizationId);
      return NextResponse.json({ error: "Unable to save the policy." }, { status: 400 });
    }

    await supabase.from("attendance_audit_log").insert({
      organization_id: organizationId, actor_id: user.id, action: "policy.set",
      entity_type: "attendance_deduction_policy", entity_id: data.id, after_data: data,
    });
    return NextResponse.json({ data });
  } catch (e) {
    console.error("Policy save failed:", e);
    return NextResponse.json({ error: "Unable to save the policy." }, { status: 500 });
  }
}