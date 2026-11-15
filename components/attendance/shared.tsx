"use client";

import type { ReactNode } from "react";

import { localizeErrorMessage } from "@/lib/localization/errorMessages";
export { localizeErrorMessage } from "@/lib/localization/errorMessages";

export async function api<T = any>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store", ...init });
  } catch (error) {
    throw new Error(localizeErrorMessage(error instanceof Error ? error.message : "network error"));
  }
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(localizeErrorMessage(payload.error ?? payload.message ?? `HTTP ${res.status}`));
  return payload as T;
}

export const cardCls = "rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm";
export const inputCls =
  "mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]";
export const labelCls = "block text-sm font-medium text-[var(--foreground)]";
export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] disabled:opacity-50";

const STATUS: Record<string, { ar: string; en: string; cls: string }> = {
  scheduled: { ar: "مجدول", en: "Scheduled", cls: "bg-slate-100 text-slate-700" },
  present: { ar: "حاضر", en: "Present", cls: "bg-emerald-100 text-emerald-800" },
  late: { ar: "متأخر", en: "Late", cls: "bg-amber-100 text-amber-800" },
  early_leave: { ar: "انصراف مبكر", en: "Early leave", cls: "bg-amber-100 text-amber-800" },
  late_early_leave: { ar: "تأخر وانصراف مبكر", en: "Late & early leave", cls: "bg-amber-100 text-amber-800" },
  possible_absence: { ar: "غياب محتمل", en: "Possible absence", cls: "bg-rose-100 text-rose-800" },
  absent_confirmed: { ar: "غياب معتمد", en: "Absent (confirmed)", cls: "bg-rose-100 text-rose-800" },
  incomplete: { ar: "سجل غير مكتمل", en: "Incomplete", cls: "bg-orange-100 text-orange-800" },
  correction_pending: { ar: "تصحيح قيد المراجعة", en: "Correction pending", cls: "bg-blue-100 text-blue-800" },
  on_leave: { ar: "إجازة معتمدة", en: "On leave", cls: "bg-sky-100 text-sky-800" },
  holiday: { ar: "عطلة", en: "Holiday", cls: "bg-slate-100 text-slate-700" },
  day_off: { ar: "يوم راحة", en: "Day off", cls: "bg-slate-100 text-slate-700" },
  needs_review: { ar: "غير معتمد", en: "Needs review", cls: "bg-amber-100 text-amber-800" },
  in_review: { ar: "قيد المراجعة", en: "In review", cls: "bg-blue-100 text-blue-800" },
  approved: { ar: "معتمد", en: "Approved", cls: "bg-emerald-100 text-emerald-800" },
  rejected: { ar: "مرفوض", en: "Rejected", cls: "bg-slate-100 text-slate-700" },
  needs_extra_approval: { ar: "يحتاج اعتمادًا إضافيًا", en: "Needs extra approval", cls: "bg-purple-100 text-purple-800" },
  apply_failed: { ar: "تعذّر إدراجه", en: "Apply failed", cls: "bg-rose-100 text-rose-800" },
  pending: { ar: "قيد المراجعة", en: "Pending", cls: "bg-amber-100 text-amber-800" },
  cancelled: { ar: "ملغي", en: "Cancelled", cls: "bg-slate-100 text-slate-700" },
  not_yet: { ar: "لم يسجّل بعد", en: "Not checked in yet", cls: "bg-slate-100 text-slate-700" },
};

export function StatusBadge({ status, isArabic }: { status: string; isArabic: boolean }) {
  const s = STATUS[status] ?? { ar: status, en: status, cls: "bg-slate-100 text-slate-700" };
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${s.cls}`}>
      {isArabic ? s.ar : s.en}
    </span>
  );
}

export function Banner({ kind, children }: { kind: "ok" | "error" | "info"; children: ReactNode }) {
  const cls =
    kind === "ok" ? "border-emerald-200 bg-emerald-50 text-emerald-800"
    : kind === "error" ? "border-rose-200 bg-rose-50 text-rose-700"
    : "border-blue-200 bg-blue-50 text-blue-800";
  return (
    <div role={kind === "error" ? "alert" : "status"} className={`mb-4 rounded-xl border px-4 py-3 text-sm ${cls}`}>
      {children}
    </div>
  );
}

export function Spinner({ label }: { label: string }) {
  return <div className="px-4 py-12 text-center text-sm text-[var(--muted-foreground)]">{label}</div>;
}

const loc = (ar: boolean) => (ar ? "ar-SA-u-nu-latn" : "en-US");

export function fmtTime(iso: string | null | undefined, tz: string | undefined, ar: boolean) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat(loc(ar), { hour: "2-digit", minute: "2-digit", timeZone: tz || "Asia/Riyadh" }).format(new Date(iso));
}

export function fmtDay(key: string, ar: boolean) {
  const [y, m, d] = key.split("-").map(Number);
  return new Intl.DateTimeFormat(loc(ar), { weekday: "short", day: "2-digit", month: "short", timeZone: "UTC" })
    .format(new Date(Date.UTC(y, m - 1, d)));
}

export function fmtMoney(n: number | string | null | undefined, ar: boolean) {
  if (n === null || n === undefined) return "—";
  return `${Number(n).toLocaleString(loc(ar), { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${ar ? "ر.س" : "SAR"}`;
}

export function fmtMinutes(min: number | null | undefined, ar: boolean) {
  if (min === null || min === undefined) return "—";
  const h = Math.floor(min / 60), m = min % 60;
  return ar ? `${h} س ${m} د` : `${h}h ${m}m`;
}

export function todayKey(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Riyadh", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export function shiftDate(key: string, n: number): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d) + n * 86_400_000).toISOString().slice(0, 10);
}

export const dayNames = (ar: boolean) =>
  ar ? ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
     : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];