import { createHash } from "node:crypto";

function text(value) {
  return value === null || value === undefined ? "" : String(value);
}

function nullableNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error(`Invalid numeric device field: ${value}`);
  return number;
}

function toOffsetDateTime(value, timezoneOffset = "+03:00") {
  const source = text(value).trim();
  if (!source) throw new Error("Device event is missing checkTime.");
  const hasOffset = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(source);
  const withOffset = hasOffset ? source : `${source}${timezoneOffset}`;
  if (!Number.isFinite(Date.parse(withOffset))) {
    throw new Error(`Invalid device checkTime: ${source}`);
  }
  return withOffset;
}

function makeExternalEventKey(record) {
  // نفس البصمة دائماً تعطي نفس المفتاح، فالإعادة ما تكرر البيانات
  const tuple = [
    text(record.userId),
    text(record.checkTime),
    text(record.checkType),
    text(record.verifyCode),
    text(record.sensorId),
    text(record.serialNumber),
    text(record.workCode),
  ];
  return createHash("sha256").update(JSON.stringify(tuple)).digest("hex");
}

function toRawEvent(record, timezoneOffset) {
  return {
    externalEventKey: makeExternalEventKey(record),
    deviceUserId: text(record.userId),
    occurredAt: toOffsetDateTime(record.checkTime, timezoneOffset),
    rawCheckType: text(record.checkType),
    verifyCode: nullableNumber(record.verifyCode),
    sensorId: text(record.sensorId),
    memoInfo: text(record.memoInfo),
    serialNumber: text(record.serialNumber),
    userExtFmt: nullableNumber(record.userExtFmt),
    workCode: nullableNumber(record.workCode),
    rawPayload: record,
  };
}

function getConfig() {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const deviceToken = process.env.ZKTECO_DEVICE_TOKEN;
  if (!supabaseUrl || !anonKey || !deviceToken) {
    throw new Error("Missing SUPABASE_URL, SUPABASE_ANON_KEY, or ZKTECO_DEVICE_TOKEN.");
  }
  return { supabaseUrl, anonKey, deviceToken };
}

async function callRpc(fn, payload, timeoutMs = 20_000) {
  const { supabaseUrl, anonKey } = getConfig();
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(timeoutMs),
  });

  const responseText = await response.text();
  if (!response.ok) {
    // لا نضع الهيدرز أو المفاتيح في رسالة الخطأ
    throw new Error(`Supabase ${fn} failed (${response.status}): ${responseText.slice(0, 500)}`);
  }
  return responseText ? JSON.parse(responseText) : {};
}

/**
 * يرفع بصمات الجهاز إلى Supabase.
 * المتغيرات المطلوبة: SUPABASE_URL, SUPABASE_ANON_KEY, ZKTECO_DEVICE_TOKEN
 * لا تستخدم SUPABASE_SERVICE_ROLE_KEY هنا أبداً.
 */
export async function publishZktecoRecords(records, options = {}) {
  if (!Array.isArray(records) || records.length === 0) {
    return { success: true, received: 0, inserted: 0, duplicates: 0 };
  }

  const { deviceToken } = getConfig();
  const timezoneOffset = options.timezoneOffset ?? "+03:00";
  const batchSize = Math.min(Math.max(Number(options.batchSize ?? 250), 1), 500);
  const totals = { success: true, received: records.length, inserted: 0, duplicates: 0 };

  for (let index = 0; index < records.length; index += batchSize) {
    const p_events = records
      .slice(index, index + batchSize)
      .map((record) => toRawEvent(record, timezoneOffset));

    const result = await callRpc(
      "ingest_attendance_device_events",
      { p_device_token: deviceToken, p_events },
      options.timeoutMs,
    );
    totals.inserted += Number(result.inserted ?? 0);
    totals.duplicates += Number(result.duplicates ?? 0);
  }

  return totals;
}

/** يرفع مستخدمي الجهاز (الاسم + رقم البادج) لصفحة الربط */
export async function publishZktecoUsers(users, options = {}) {
  if (!Array.isArray(users) || users.length === 0) {
    return { success: true, received: 0, upserted: 0 };
  }

  const { deviceToken } = getConfig();
  const p_users = users
    .filter((u) => u.userId !== null && u.userId !== undefined && text(u.userId) !== "")
    .map((u) => ({
      deviceUserId: text(u.userId),
      badgeNumber: text(u.badgeNumber),
      name: text(u.name),
    }));

  const result = await callRpc(
    "ingest_attendance_device_users",
    { p_device_token: deviceToken, p_users },
    options.timeoutMs,
  );
  return { success: true, received: p_users.length, upserted: Number(result.upserted ?? 0) };
}