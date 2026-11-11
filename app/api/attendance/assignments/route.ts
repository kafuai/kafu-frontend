import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getAttendanceContext, isUuid } from "@/src/enterprise/business/attendance/core/attendanceContext";
import { dateKeyInTz, isDateKey } from "@/src/enterprise/business/attendance/utils/time";
import { DEFAULT_TZ } from "@/src/enterprise/business/attendance/utils/schedule";

export async function GET() {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_MANAGE);
    if ("error" in ctx) return ctx.error;
    const { supabase, organizationId } = ctx;

    const admin = createSupabaseAdminClient();
    const { data: mem, error: mErr } = await admin
      .from("organization_memberships").select("user_id,role").eq("organization_id", organizationId);
    if (mErr) throw new Error(mErr.message);

    const ids = (mem ?? []).map((m) => m.user_id as string);
    const { data: profs } = ids.length
      ? await admin.from("profiles").select("id,full_name,email").in("id", ids)
      : { data: [] as any[] };
    const profById = new Map((profs ?? []).map((p) => [p.id as string, p]));
    const members = (mem ?? []).map((m) => {
      const p = profById.get(m.user_id as string);
      return { userId: m.user_id, role: m.role, name: p?.full_name?.trim() || p?.email || m.user_id, email: p?.email ?? null };
    });

    const { data: assignments, error } = await supabase
      .from("shift_assignments")
      .select("id,user_id,shift_id,effective_from,effective_to,created_at")
      .eq("organization_id", organizationId)
      .order("effective_from", { ascending: false });
    if (error) throw new Error(error.message);

    return NextResponse.json({ members, data: assignments });
  } catch (e) {
    console.error("Assignments load failed:", e);
    return NextResponse.json({ error: "Unable to load assignments." }, { status: 500 });
  }
}

/** POST { userIds[], shiftId, locationId?, effectiveFrom, effectiveTo? } */
export async function POST(request: Request) {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_MANAGE);
    if ("error" in ctx) return ctx.error;
    const { supabase, user, organizationId } = ctx;

    const b = await request.json().catch(() => ({}));
    const userIds: string[] = Array.isArray(b.userIds) ? [...new Set(b.userIds as string[])] : [];
    const today = dateKeyInTz(Date.now(), DEFAULT_TZ);


    if (userIds.length < 1 || userIds.length > 200 || !userIds.every(isUuid)) {
      return NextResponse.json({ error: "Select at least one employee." }, { status: 400 });
    }
    if (!isUuid(b.shiftId)) return NextResponse.json({ error: "Invalid shift." }, { status: 400 });
    if (!isDateKey(b.effectiveFrom) || b.effectiveFrom < today) {
      return NextResponse.json({ error: "Start date cannot be in the past." }, { status: 400 });
    }
    if (b.effectiveTo != null && (!isDateKey(b.effectiveTo) || b.effectiveTo < b.effectiveFrom)) {
      return NextResponse.json({ error: "Invalid end date." }, { status: 400 });
    }

    // الموظفون يجب أن يكونوا أعضاء في نفس المنشأة
    const { data: mem, error: mErr } = await createSupabaseAdminClient()
      .from("organization_memberships").select("user_id")
      .eq("organization_id", organizationId).in("user_id", userIds);
    if (mErr) throw new Error(mErr.message);
    if ((mem ?? []).length !== userIds.length) {
      return NextResponse.json({ error: "Some users are not members of this organization." }, { status: 400 });
    }

  
    const { data: shift, error: sErr } = await supabase.from("shifts")
      .select("id,device_id").eq("id", b.shiftId).eq("organization_id", organizationId).maybeSingle();
    if (sErr) throw new Error(sErr.message);
    if (!shift) return NextResponse.json({ error: "Invalid shift." }, { status: 400 });

    if (shift.device_id) {
      const admin = createSupabaseAdminClient();
      const { data: dev, error: dErr } = await admin.from("attendance_devices")
        .select("id,name,is_active").eq("id", shift.device_id).eq("organization_id", organizationId).maybeSingle();
      if (dErr) throw new Error(dErr.message);
      if (!dev || !dev.is_active) {
        return NextResponse.json({ error: "The device of this shift is disabled. Enable it first." }, { status: 409 });
      }

      const { data: links, error: lErr } = await admin.from("attendance_device_user_mappings")
        .select("user_id").eq("organization_id", organizationId)
        .eq("device_id", dev.id).eq("is_active", true).in("user_id", userIds);
      if (lErr) throw new Error(lErr.message);
      const linked = new Set((links ?? []).map((l) => l.user_id as string));
      const missing = userIds.filter((u) => !linked.has(u));
      if (missing.length > 0) {
        const { data: profs } = await admin.from("profiles").select("id,full_name,email").in("id", missing);
        const names = (profs ?? []).map((p) => p.full_name?.trim() || p.email || p.id).join(", ");
        return NextResponse.json(
          { error: `These employees are not linked to the device "${dev.name}": ${names}. Link them first from the devices page.` },
          { status: 400 },
        );
      }
    }

    const { data, error } = await supabase.from("shift_assignments")
      .insert(userIds.map((uid) => ({
        organization_id: organizationId,
        user_id: uid,
        shift_id: b.shiftId,
        effective_from: b.effectiveFrom,
        effective_to: b.effectiveTo ?? null,
        created_by: user.id,
      })))
      .select("id,user_id");

    if (error) {
      if (error.code === "23P01") {
        return NextResponse.json({ error: "One or more employees already have a shift in this period. End the current assignment first." }, { status: 409 });
      }
      if (error.code === "23503") return NextResponse.json({ error: "Invalid shift or location." }, { status: 400 });
      throw new Error(error.message);
    }

    await supabase.from("attendance_audit_log").insert({
      organization_id: organizationId, actor_id: user.id, action: "assignment.create",
      entity_type: "shift_assignment", after_data: { shiftId: b.shiftId, userIds, from: b.effectiveFrom, to: b.effectiveTo ?? null },
    });
    return NextResponse.json({ data }, { status: 201 });
  } catch (e) {
    console.error("Assignment create failed:", e);
    return NextResponse.json({ error: "Unable to assign shift." }, { status: 500 });
  }
}

/** PATCH { id, effectiveTo } — إنهاء إسناد (لا يمكن أن يسبق آخر يوم مُقيَّم) */
export async function PATCH(request: Request) {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_MANAGE);
    if ("error" in ctx) return ctx.error;
    const { supabase, user, organizationId } = ctx;

    const b = await request.json().catch(() => ({}));
    if (!isUuid(b.id) || !isDateKey(b.effectiveTo)) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

    const { data: cur } = await supabase.from("shift_assignments").select("effective_from")
      .eq("id", b.id).eq("organization_id", organizationId).maybeSingle();
    if (!cur) return NextResponse.json({ error: "Not found." }, { status: 404 });
    if (b.effectiveTo < cur.effective_from) return NextResponse.json({ error: "Invalid end date." }, { status: 400 });

    const { data: last } = await supabase.from("attendance_days").select("work_date")
      .eq("organization_id", organizationId).eq("assignment_id", b.id)
      .order("work_date", { ascending: false }).limit(1).maybeSingle();
    if (last && b.effectiveTo < last.work_date) {
      return NextResponse.json({ error: `The end date cannot be earlier than the last evaluated day (${last.work_date}).` }, { status: 409 });
    }

    const { data, error } = await supabase.from("shift_assignments")
      .update({ effective_to: b.effectiveTo })
      .eq("id", b.id).eq("organization_id", organizationId)
      .select("id,effective_to").maybeSingle();
    if (error) throw new Error(error.message);

    await supabase.from("attendance_audit_log").insert({
      organization_id: organizationId, actor_id: user.id, action: "assignment.end",
      entity_type: "shift_assignment", entity_id: b.id, after_data: { effectiveTo: b.effectiveTo },
    });
    return NextResponse.json({ data });
  } catch (e) {
    console.error("Assignment update failed:", e);
    return NextResponse.json({ error: "Unable to update assignment." }, { status: 500 });
  }
}


export async function DELETE(request: Request) {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_MANAGE);
    if ("error" in ctx) return ctx.error;
    
    const b = await request.json().catch(() => ({}));
    if (!isUuid(b.id)) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

   
    const { data: days } = await ctx.supabase.from("attendance_days")
      .select("id").eq("assignment_id", b.id).limit(1);
      
    if (days && days.length > 0) {
      return NextResponse.json({ error: "لا يمكن حذف إسناد تم تقييمه وحساب حضوره. استخدم خيار (إنهاء اليوم) بدلاً من ذلك." }, { status: 409 });
    }

    const { error } = await ctx.supabase.from("shift_assignments")
      .delete()
      .eq("id", b.id).eq("organization_id", ctx.organizationId);
      
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Unable to delete assignment." }, { status: 500 });
  }
}