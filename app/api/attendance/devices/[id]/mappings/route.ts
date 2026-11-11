import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getAttendanceContext, isUuid } from "@/src/enterprise/business/attendance/core/attendanceContext";
import { processDeviceEvents } from "@/src/enterprise/business/attendance/core/deviceProcessor";

type RouteContext = { params: Promise<{ id: string }> };

/** GET: مستخدمو الجهاز + حالة ربط كل واحد + أعضاء المنظمة */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_MANAGE);
    if ("error" in ctx) return ctx.error;

    const { id } = await context.params;
    if (!isUuid(id)) return NextResponse.json({ error: "Invalid device ID." }, { status: 400 });

    const admin = createSupabaseAdminClient();

    const { data: device, error: devErr } = await admin.from("attendance_devices")
      .select("id").eq("id", id).eq("organization_id", ctx.organizationId).maybeSingle();
    if (devErr) throw new Error(devErr.message);
    if (!device) return NextResponse.json({ error: "Device not found." }, { status: 404 });

    const [users, maps, members, pending] = await Promise.all([
      admin.from("attendance_device_users")
        .select("device_user_id,badge_number,name")
        .eq("organization_id", ctx.organizationId).eq("device_id", id)
        .order("device_user_id"),
      admin.from("attendance_device_user_mappings")
        .select("id,device_user_id,user_id")
        .eq("organization_id", ctx.organizationId).eq("device_id", id).eq("is_active", true),
      admin.from("organization_memberships")
        .select("user_id,role").eq("organization_id", ctx.organizationId),
      admin.from("attendance_device_raw_events")
        .select("device_user_id")
        .eq("organization_id", ctx.organizationId).eq("device_id", id)
        .eq("processing_status", "unmapped_employee"),
    ]);
    for (const r of [users, maps, members, pending]) if (r.error) throw new Error(r.error.message);

    const memberIds = (members.data ?? []).map((m) => m.user_id as string);
    const { data: profs } = memberIds.length
      ? await admin.from("profiles").select("id,full_name,email").in("id", memberIds)
      : { data: [] as any[] };
    const profById = new Map((profs ?? []).map((p) => [p.id as string, p]));

    const { data: emps } = memberIds.length
      ? await admin.from("payroll_employees")
          .select("user_id,employee_number,full_name")
          .eq("organization_id", ctx.organizationId).in("user_id", memberIds)
      : { data: [] as any[] };
    const empByUser = new Map((emps ?? []).map((e) => [e.user_id as string, e]));

    const mapByDeviceUser = new Map((maps.data ?? []).map((m) => [m.device_user_id as string, m]));

    const pendingCount = new Map<string, number>();
    for (const p of pending.data ?? []) {
      pendingCount.set(p.device_user_id, (pendingCount.get(p.device_user_id) ?? 0) + 1);
    }

    return NextResponse.json({
      members: (members.data ?? []).map((m) => {
        const p = profById.get(m.user_id as string);
        const e = empByUser.get(m.user_id as string);
        return {
          userId: m.user_id,
          name: e?.full_name?.trim() || p?.full_name?.trim() || p?.email || m.user_id,
          employeeNumber: e?.employee_number ?? null,
        };
      }),
      deviceUsers: (users.data ?? []).map((u) => {
        const m = mapByDeviceUser.get(u.device_user_id);
        return {
          deviceUserId: u.device_user_id,
          badgeNumber: u.badge_number,
          name: u.name,
          mappingId: m?.id ?? null,
          mappedUserId: m?.user_id ?? null,
          pendingEvents: pendingCount.get(u.device_user_id) ?? 0,
        };
      }),
    });
  } catch (error) {
    console.error("Device mappings load failed:", error);
    return NextResponse.json({ error: "Unable to load device mappings." }, { status: 500 });
  }
}

/** PUT { deviceUserId, userId } — ربط (أو تغيير ربط) مستخدم جهاز بموظف */
export async function PUT(request: Request, context: RouteContext) {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_MANAGE);
    if ("error" in ctx) return ctx.error;

    const { id } = await context.params;
    if (!isUuid(id)) return NextResponse.json({ error: "Invalid device ID." }, { status: 400 });

    const body = await request.json().catch(() => null);
    const deviceUserId = typeof body?.deviceUserId === "string" ? body.deviceUserId.trim() : "";
    if (!deviceUserId || deviceUserId.length > 60) {
      return NextResponse.json({ error: "Invalid device user." }, { status: 400 });
    }
    if (!isUuid(body?.userId)) return NextResponse.json({ error: "Invalid employee." }, { status: 400 });

    const admin = createSupabaseAdminClient();

    const { data: device } = await admin.from("attendance_devices")
      .select("id").eq("id", id).eq("organization_id", ctx.organizationId).maybeSingle();
    if (!device) return NextResponse.json({ error: "Device not found." }, { status: 404 });

    const { data: member } = await admin.from("organization_memberships")
      .select("user_id").eq("organization_id", ctx.organizationId).eq("user_id", body.userId).maybeSingle();
    if (!member) return NextResponse.json({ error: "The employee is not a member of this organization." }, { status: 400 });
        // رقم المستخدم لازم يكون من مستخدمي هذا الجهاز فقط
    const { data: knownUser } = await admin.from("attendance_device_users")
      .select("device_user_id").eq("organization_id", ctx.organizationId)
      .eq("device_id", id).eq("device_user_id", deviceUserId).maybeSingle();
    if (!knownUser) return NextResponse.json({ error: "This user ID does not exist on the selected device." }, { status: 400 });

    // منع استبدال ربط موظف آخر بالخطأ (التعديل المقصود يرسل replace: true)
    const { data: current } = await admin.from("attendance_device_user_mappings")
      .select("user_id").eq("organization_id", ctx.organizationId)
      .eq("device_id", id).eq("device_user_id", deviceUserId).eq("is_active", true).maybeSingle();
    if (current && current.user_id !== body.userId && body.replace !== true) {
      return NextResponse.json({ error: "This device user is already linked to another employee." }, { status: 409 });
    }

    // الموظف مربوط أصلاً بمستخدم ثاني على نفس الجهاز؟
    const { data: taken } = await admin.from("attendance_device_user_mappings")
      .select("device_user_id").eq("organization_id", ctx.organizationId)
      .eq("device_id", id).eq("user_id", body.userId).eq("is_active", true)
      .neq("device_user_id", deviceUserId).maybeSingle();
    if (taken) {
      return NextResponse.json(
        { error: `This employee is already linked to device user ${taken.device_user_id}. Remove that link first.` },
        { status: 409 },
      );
    }

    // نعطّل الربط القديم لهذا المستخدم (إن وجد) ثم ننشئ الجديد
    const { error: offErr } = await admin.from("attendance_device_user_mappings")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("organization_id", ctx.organizationId).eq("device_id", id)
      .eq("device_user_id", deviceUserId).eq("is_active", true);
    if (offErr) throw new Error(offErr.message);

    const { data, error } = await admin.from("attendance_device_user_mappings")
      .insert({
        organization_id: ctx.organizationId,
        device_id: id,
        device_user_id: deviceUserId,
        user_id: body.userId,
        is_active: true,
        created_by: ctx.user.id,
      })
      .select("id,device_user_id,user_id").single();
    if (error?.code === "23505") {
      return NextResponse.json({ error: "This link already exists." }, { status: 409 });
    }
    if (error) throw new Error(error.message);

    await admin.from("attendance_audit_log").insert({
      organization_id: ctx.organizationId, actor_id: ctx.user.id, action: "device_mapping.set",
      entity_type: "attendance_device_user_mapping", entity_id: data.id,
      after_data: { deviceId: id, deviceUserId, userId: body.userId },
    });

        // نعالج البصمات المعلّقة لهذا الموظف مباشرة بعد الربط
    let processed: unknown = null;
    try {
      const { data: dev } = await admin.from("attendance_devices")
        .select("id,organization_id,timezone,check_in_value,check_out_value")
        .eq("id", id).eq("organization_id", ctx.organizationId).maybeSingle();
      if (dev) {
        const r = await processDeviceEvents(admin, dev, { limit: 500 });
        if (r.ok) processed = { processed: r.processed, noShift: r.noShift };
      }
    } catch (e) {
      console.error("Post-link processing failed:", e);
    }

    return NextResponse.json({ data, processed }, { status: 201 });
  } catch (error) {
    console.error("Device mapping save failed:", error);
    return NextResponse.json({ error: "Unable to save the link." }, { status: 500 });
  }
}

/** DELETE { deviceUserId } — فك الربط */
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_MANAGE);
    if ("error" in ctx) return ctx.error;

    const { id } = await context.params;
    if (!isUuid(id)) return NextResponse.json({ error: "Invalid device ID." }, { status: 400 });

    const body = await request.json().catch(() => null);
    const deviceUserId = typeof body?.deviceUserId === "string" ? body.deviceUserId.trim() : "";
    if (!deviceUserId) return NextResponse.json({ error: "Invalid device user." }, { status: 400 });

    const { error } = await createSupabaseAdminClient().from("attendance_device_user_mappings")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("organization_id", ctx.organizationId).eq("device_id", id)
      .eq("device_user_id", deviceUserId).eq("is_active", true);
    if (error) throw new Error(error.message);

    await createSupabaseAdminClient().from("attendance_audit_log").insert({
      organization_id: ctx.organizationId, actor_id: ctx.user.id, action: "device_mapping.remove",
      entity_type: "attendance_device_user_mapping",
      after_data: { deviceId: id, deviceUserId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Device mapping remove failed:", error);
    return NextResponse.json({ error: "Unable to remove the link." }, { status: 500 });
  }
}