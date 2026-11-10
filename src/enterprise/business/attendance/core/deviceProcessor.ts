import "server-only";
import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { addDays, dateKeyInTz } from "../utils/time";
import {
  buildSchedule, CHECKOUT_GRACE_MINUTES, type AssignmentRow, type Schedule,
} from "../utils/schedule";
import { hydrate } from "./shiftResolver";

const MIN = 60_000;

export type DeviceRow = {
  id: string;
  organization_id: string;
  timezone: string;
  check_in_value: string | null;
  check_out_value: string | null;
};

type RawEvent = {
  id: string;
  device_user_id: string;
  occurred_at: string;
  raw_check_type: string | null;
  verify_code: number | null;
  sensor_id: string | null;
  serial_number: string | null;
};

type Planned = {
  raw: RawEvent;
  userId: string;
  eventType: "check_in" | "check_out";
  assignment: AssignmentRow;
  locationId: string | null;
  schedule: Schedule;
};

export async function processDeviceEvents(
  admin: SupabaseClient,
  device: DeviceRow,
  opts: { limit?: number; dryRun?: boolean } = {},
) {
  const orgId = device.organization_id;
  const limit = opts.limit ?? 200;
  const dryRun = opts.dryRun === true;

  if (!device.check_in_value || !device.check_out_value) {
    return { ok: false as const, status: 409, error: "Set the device check-in and check-out values first." };
  }

  const [rawRes, mapRes] = await Promise.all([
    admin.from("attendance_device_raw_events").select("*")
      .eq("organization_id", orgId).eq("device_id", device.id)
      .in("processing_status", ["pending", "unmapped_employee", "unmapped_type", "error"])
      .order("occurred_at", { ascending: true }).limit(limit),
    admin.from("attendance_device_user_mappings").select("device_user_id,user_id")
      .eq("organization_id", orgId).eq("device_id", device.id).eq("is_active", true),
  ]);
  if (rawRes.error) throw new Error(rawRes.error.message);
  if (mapRes.error) throw new Error(mapRes.error.message);

  const rawEvents = (rawRes.data ?? []) as RawEvent[];
  const mapping = new Map((mapRes.data ?? []).map((m) => [m.device_user_id as string, m.user_id as string]));

  const result = {
    dryRun, examined: rawEvents.length, processed: 0, unmappedEmployees: 0,
    unmappedTypes: 0, noShift: 0, duplicates: 0, failed: 0,
  };

  const mark = async (id: string, patch: Record<string, unknown>) => {
    if (dryRun) return;
    await admin.from("attendance_device_raw_events").update(patch)
      .eq("id", id).eq("organization_id", orgId);
  };

  // 1) الربط ونوع البصمة
  const valid: { raw: RawEvent; userId: string; eventType: "check_in" | "check_out" }[] = [];
  for (const raw of rawEvents) {
    const userId = mapping.get(raw.device_user_id);
    if (!userId) {
      result.unmappedEmployees++;
      await mark(raw.id, {
        processing_status: "unmapped_employee",
        processing_error: "No active employee mapping exists for this device user ID.",
      });
      continue;
    }
    const eventType =
      raw.raw_check_type === device.check_in_value ? "check_in"
      : raw.raw_check_type === device.check_out_value ? "check_out"
      : null;
    if (!eventType) {
      result.unmappedTypes++;
      await mark(raw.id, {
        processing_status: "unmapped_type",
        processing_error: "The device check type is not mapped to check-in or check-out.",
      });
      continue;
    }
    valid.push({ raw, userId, eventType });
  }

  // 2) إسنادات الورديات
  let assignments: AssignmentRow[] = [];
  if (valid.length > 0) {
    const days = valid
      .map((v) => dateKeyInTz(new Date(v.raw.occurred_at).getTime(), device.timezone))
      .sort();
    const { data, error } = await admin.from("shift_assignments")
      .select("id,user_id,shift_id,location_id,effective_from,effective_to")
      .eq("organization_id", orgId)
      .in("user_id", [...new Set(valid.map((v) => v.userId))])
      .lte("effective_from", addDays(days[days.length - 1], 2))
      .or(`effective_to.is.null,effective_to.gte.${addDays(days[0], -2)}`);
    if (error) throw new Error(error.message);
    assignments = (data ?? []) as AssignmentRow[];
  }
  const { shiftById, locById } = await hydrate(admin, orgId, assignments);

  // 3) تحديد الوردية (ومنها work_date)
  const planned: Planned[] = [];
  for (const v of valid) {
    const t = new Date(v.raw.occurred_at).getTime();
    const day = dateKeyInTz(t, device.timezone);
    let best: Planned | null = null;

    for (const a of assignments.filter((x) => x.user_id === v.userId)) {
      const shift = shiftById.get(a.shift_id);
      if (!shift) continue;
      const loc = locById.get(a.location_id ?? shift.location_id ?? "") ?? null;

      for (const d of [addDays(day, -1), day, addDays(day, 1)]) {
        const s = buildSchedule(a, shift, loc, d);
        if (!s) continue;
        const inWindow = v.eventType === "check_in"
          ? t >= s.start - s.earlyCheckinMinutes * MIN && t <= s.end
          : t >= s.start && t <= s.end + CHECKOUT_GRACE_MINUTES * MIN;
        if (!inWindow) continue;

        const better = !best
          || (v.eventType === "check_in"
            ? Math.abs(t - s.start) < Math.abs(t - best.schedule.start)
            : s.start > best.schedule.start);
        if (better) best = { ...v, assignment: a, locationId: loc?.id ?? null, schedule: s };
      }
    }

    if (!best) {
      result.noShift++;
      await mark(v.raw.id, {
        processing_status: "ignored",
        processing_error: "No shift assignment covers this punch time.",
        processed_at: new Date().toISOString(),
      });
      continue;
    }
    planned.push(best);
  }

  if (dryRun) {
    return {
      ok: true as const, ...result, wouldProcess: planned.length,
      sample: planned.slice(0, 20).map((p) => ({
        deviceUserId: p.raw.device_user_id, userId: p.userId, type: p.eventType,
        occurredAt: p.raw.occurred_at, workDate: p.schedule.workDate,
      })),
    };
  }

  // 4) الإدخال الفعلي
  for (const p of planned) {
    try {
      const { data: inserted, error: insertError } = await admin.from("attendance_events").insert({
        organization_id: orgId,
        user_id: p.userId,
        assignment_id: p.assignment.id,
        shift_id: p.assignment.shift_id,
        location_id: p.locationId,
        work_date: p.schedule.workDate,
        event_type: p.eventType,
        source: "device",
        occurred_at: p.raw.occurred_at,
        scheduled_start: new Date(p.schedule.start).toISOString(),
        scheduled_end: new Date(p.schedule.end).toISOString(),
        geo_status: "not_required",
        client_meta: {
          integration: "zkteco",
          deviceId: device.id,
          deviceUserId: p.raw.device_user_id,
          rawCheckType: p.raw.raw_check_type,
          verifyCode: p.raw.verify_code,
          sensorId: p.raw.sensor_id,
          serialNumber: p.raw.serial_number,
        },
        idempotency_key: randomUUID(),
        device_event_id: p.raw.id,
      }).select("id").single();

      let eventId: string | null = inserted?.id ?? null;

      if (insertError?.code === "23505") {
        const { data: existing } = await admin.from("attendance_events")
          .select("id").eq("device_event_id", p.raw.id).maybeSingle();
        if (!existing) throw new Error(insertError.message);
        eventId = existing.id;
        result.duplicates++;
      } else if (insertError) {
        throw new Error(insertError.message);
      } else {
        result.processed++;
      }

      await mark(p.raw.id, {
        processing_status: "processed",
        attendance_event_id: eventId,
        processing_error: null,
        processed_at: new Date().toISOString(),
      });
    } catch (error) {
      result.failed++;
      await mark(p.raw.id, {
        processing_status: "error",
        processing_error: error instanceof Error ? error.message.slice(0, 500) : "Unknown error.",
      });
    }
  }

  return { ok: true as const, ...result };
}