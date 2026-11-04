import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";
import { getAttendanceContext, isUuid } from "@/src/enterprise/business/attendance/core/attendanceContext";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { isDateKey } from "@/src/enterprise/business/attendance/utils/time";

const isOwner = (role: string | null | undefined) => role?.trim().toLowerCase() === "owner";
const dateList = (from: string, to: string) => {
  const out: string[] = [];
  const cursor = new Date(`${from}T00:00:00.000Z`);
  const end = new Date(`${to}T00:00:00.000Z`);
  while (cursor <= end) {
    out.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return out;
};

export async function GET() {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_MANAGE);
    if ("error" in ctx) return ctx.error;
    if (!isOwner(ctx.identity.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const admin = createSupabaseAdminClient();
    const [{ data: periods, error: pErr }, { data: memberships, error: mErr }] = await Promise.all([
      admin.from("organization_holiday_periods").select("id,name,start_date,end_date,created_at")
        .eq("organization_id", ctx.organizationId).order("start_date", { ascending: false }),
      admin.from("organization_memberships").select("user_id,role")
        .eq("organization_id", ctx.organizationId),
    ]);
    if (pErr) throw new Error(pErr.message);
    if (mErr) throw new Error(mErr.message);

    const userIds = (memberships ?? []).map((m) => m.user_id as string);
    const [{ data: profiles, error: profileErr }, { data: assignments, error: aErr }, { data: payrollEmployees, error: payrollError }] = await Promise.all([
      userIds.length ? admin.from("profiles").select("id,full_name,email").in("id", userIds) : Promise.resolve({ data: [], error: null }),
      admin.from("organization_holiday_assignments").select("id,holiday_period_id,user_id,overtime_enabled,overtime_calculation_type,overtime_percentage,overtime_fixed_daily_amount")
        .eq("organization_id", ctx.organizationId),
      admin.from("payroll_employees").select("user_id,basic_salary").eq("organization_id", ctx.organizationId).eq("status", "active").in("user_id", userIds.length ? userIds : ["00000000-0000-0000-0000-000000000000"]),
    ]);
    if (profileErr) throw new Error(profileErr.message);
    if (aErr) throw new Error(aErr.message);
    if (payrollError) throw new Error(payrollError.message);

    const profileById = new Map((profiles ?? []).map((p) => [p.id as string, p]));
    const payrollUserIds = new Set((payrollEmployees ?? []).map((e) => e.user_id as string));
    const members = (memberships ?? []).map((m) => {
      const p = profileById.get(m.user_id as string);
      const payrollRecord = (payrollEmployees ?? []).find((e) => e.user_id === m.user_id) as { user_id: string; basic_salary?: number | string | null } | undefined;
      return { userId: m.user_id, role: m.role, name: p?.full_name?.trim() || p?.email || m.user_id, payrollEligible: payrollUserIds.has(m.user_id as string), basicSalary: payrollRecord?.basic_salary ?? null };
    });
    return NextResponse.json({ data: periods ?? [], assignments: assignments ?? [], members });
  } catch (error) {
    console.error("Holiday settings load failed:", error);
    return NextResponse.json({ error: "Unable to load holiday settings." }, { status: 500 });
  }
}

/** Create one holiday period and its employee work permissions. */
export async function POST(request: Request) {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_MANAGE);
    if ("error" in ctx) return ctx.error;
    if (!isOwner(ctx.identity.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json().catch(() => null);
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const startDate = body?.startDate;
    const endDate = body?.endDate;
    const employees = Array.isArray(body?.employees) ? body.employees : [];
    if (!name || name.length > 160 || !isDateKey(startDate) || !isDateKey(endDate) || endDate < startDate) {
      return NextResponse.json({ error: "Enter a valid name and date range." }, { status: 400 });
    }
    const days = dateList(startDate, endDate);
    if (days.length > 62) return NextResponse.json({ error: "A holiday period cannot exceed 62 days." }, { status: 400 });
    if (!employees.length || employees.length > 500) {
      return NextResponse.json({ error: "Select at least one employee permitted to work." }, { status: 400 });
    }
    const normalized: { userId: string; overtimeEnabled: boolean; overtimeMode: "percentage" | "fixed_daily"; overtimeValue: number }[] = [];
    for (const value of employees as unknown[]) {
      if (!value || typeof value !== "object") {
        return NextResponse.json({ error: "Check employee selection and overtime percentages." }, { status: 400 });
      }
      const employee = value as Record<string, unknown>;
      const userId = employee.userId;
      const overtimeEnabled = employee.overtimeEnabled === true;
      const overtimeMode = employee.overtimeMode === "fixed_daily" ? "fixed_daily" : employee.overtimeMode === "percentage" ? "percentage" : null;
      const overtimeValue = Number(employee.overtimeValue ?? 0);
      if (!isUuid(userId) || !overtimeMode || !Number.isFinite(overtimeValue) || overtimeValue < 0 || (overtimeEnabled && overtimeMode === "fixed_daily" && overtimeValue <= 0)) {
        return NextResponse.json({ error: "Check employee selection and daily overtime settings." }, { status: 400 });
      }
      normalized.push({ userId, overtimeEnabled, overtimeMode, overtimeValue });
    }
    if (new Set(normalized.map((e) => e.userId)).size !== normalized.length) {
      return NextResponse.json({ error: "An employee can only be selected once." }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();
    const { data: overlapping, error: overlapError } = await admin.from("organization_holiday_periods")
      .select("id").eq("organization_id", ctx.organizationId)
      .lte("start_date", endDate).gte("end_date", startDate).limit(1);
    if (overlapError) throw new Error(overlapError.message);
    if (overlapping?.length) {
      return NextResponse.json({ error: "Holiday date ranges cannot overlap. Update or remove the existing holiday first." }, { status: 409 });
    }
    const ids = normalized.map((e) => e.userId);
    const { data: memberships, error: membershipError } = await admin.from("organization_memberships")
      .select("user_id").eq("organization_id", ctx.organizationId).in("user_id", ids);
    if (membershipError) throw new Error(membershipError.message);
    if ((memberships ?? []).length !== ids.length) {
      return NextResponse.json({ error: "All selected employees must belong to this organization." }, { status: 400 });
    }
    const { data: payrollEmployees, error: payrollError } = await admin.from("payroll_employees")
      .select("user_id,basic_salary").eq("organization_id", ctx.organizationId).eq("status", "active").in("user_id", ids);
    if (payrollError) throw new Error(payrollError.message);
    const payrollEligibleIds = new Set((payrollEmployees ?? []).map((employee) => employee.user_id as string));
    if (ids.some((id) => !payrollEligibleIds.has(id))) {
      return NextResponse.json({ error: "Every selected employee must have an active payroll employee record linked to their user account." }, { status: 400 });
    }

    const { data: period, error: periodError } = await admin.from("organization_holiday_periods").insert({
      organization_id: ctx.organizationId, name, start_date: startDate, end_date: endDate, created_by: ctx.user.id,
    }).select("id,name,start_date,end_date,created_at").single();
    if (periodError || !period) throw new Error(periodError?.message ?? "Failed to create holiday period");

    const { error: dailyError } = await admin.from("organization_holidays").insert(days.map((holidayDate) => ({
      organization_id: ctx.organizationId, holiday_date: holidayDate, name, holiday_period_id: period.id,
    })));
    if (dailyError) {
      await admin.from("organization_holiday_periods").delete().eq("id", period.id).eq("organization_id", ctx.organizationId);
      throw new Error(dailyError.message);
    }

    const { error: assignmentError } = await admin.from("organization_holiday_assignments").insert(normalized.map((e) => ({
      organization_id: ctx.organizationId, holiday_period_id: period.id, user_id: e.userId,
      overtime_enabled: e.overtimeEnabled,
      overtime_calculation_type: e.overtimeMode,
      overtime_percentage: e.overtimeEnabled && e.overtimeMode === "percentage" ? e.overtimeValue : 0,
      overtime_fixed_daily_amount: e.overtimeEnabled && e.overtimeMode === "fixed_daily" ? e.overtimeValue : 0,
      created_by: ctx.user.id,
    })));
    if (assignmentError) {
      await admin.from("organization_holiday_periods").delete().eq("id", period.id).eq("organization_id", ctx.organizationId);
      throw new Error(assignmentError.message);
    }

    await admin.from("attendance_audit_log").insert({
      organization_id: ctx.organizationId, actor_id: ctx.user.id, action: "holiday.create",
      entity_type: "organization_holiday_period", entity_id: period.id,
      after_data: { name, startDate, endDate, employeeCount: normalized.length },
    });
    return NextResponse.json({ data: period }, { status: 201 });
  } catch (error) {
    console.error("Holiday create failed:", error);
    return NextResponse.json({ error: "Unable to create holiday. No payroll or attendance records were changed." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_MANAGE);
    if ("error" in ctx) return ctx.error;
    if (!isOwner(ctx.identity.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const body = await request.json().catch(() => null);
    if (!isUuid(body?.id)) return NextResponse.json({ error: "Invalid holiday." }, { status: 400 });

    const admin = createSupabaseAdminClient();
    const { data: period } = await admin.from("organization_holiday_periods").select("id,name,start_date,end_date")
      .eq("organization_id", ctx.organizationId).eq("id", body.id).maybeSingle();
    if (!period) return NextResponse.json({ error: "Holiday not found." }, { status: 404 });
    const { data: assigned } = await admin.from("organization_holiday_assignments").select("id")
      .eq("organization_id", ctx.organizationId).eq("holiday_period_id", period.id);
    const assignmentIds = (assigned ?? []).map((a) => a.id as string);
    if (assignmentIds.length) {
      const { data: used, error } = await admin.from("holiday_overtime_applications").select("id")
        .eq("organization_id", ctx.organizationId).in("holiday_assignment_id", assignmentIds).limit(1);
      if (error) throw new Error(error.message);
      if (used?.length) return NextResponse.json({ error: "This holiday is already included in payroll and cannot be deleted." }, { status: 409 });
    }
    const { error } = await admin.from("organization_holiday_periods").delete()
      .eq("organization_id", ctx.organizationId).eq("id", period.id);
    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Holiday delete failed:", error);
    return NextResponse.json({ error: "Unable to delete holiday." }, { status: 500 });
  }
}
