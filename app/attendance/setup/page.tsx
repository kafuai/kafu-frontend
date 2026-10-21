"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check, Clock, Edit, Map as MapIcon, MapPin, Plus, Power, PowerOff, Save, UserCheck, Users, X,
} from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { api, Banner, dayNames, shiftDate, todayKey } from "@/components/attendance/shared";

type Tab = "locations" | "shifts" | "assignments";

/* ------------------------------ styles ------------------------------ */

const panelCls =
  "overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]";
const panelHeadCls =
  "flex items-center justify-between gap-3 border-b border-[var(--border-default)] bg-[var(--surface-muted)] px-5 py-4";
const labelCls = "block text-xs font-black text-[var(--text-secondary)]";
const inputCls =
  "mt-1 block h-11 w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm font-bold text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:bg-[var(--surface)]";
const primaryBtn =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 text-sm font-black text-white transition hover:opacity-90 disabled:opacity-50";
const secondaryBtn =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-5 text-sm font-black text-[var(--text-secondary)] transition hover:border-[var(--brand-primary)] hover:bg-[var(--brand-subtle)] disabled:opacity-50";
const iconBtn =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--surface)] px-3 text-xs font-black text-[var(--text-secondary)] transition hover:border-[var(--brand-primary)] hover:bg-[var(--brand-subtle)] disabled:opacity-50";

const EMPTY_SHIFT = {
  name: "", startTime: "08:00", endTime: "16:00", workDays: [0, 1, 2, 3, 4],
  graceMinutes: 10, breakMinutes: 0, earlyCheckinMinutes: 120, locationId: "",
};

const sameDays = (a: number[], b: number[]) =>
  a.length === b.length && [...a].sort().every((v, i) => v === [...b].sort()[i]);

/* -------------------------------- page -------------------------------- */

export default function AttendanceSetupPage() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";

  const copy = isArabic
    ? {
        badge: "ATTENDANCE", badgeSub: "إعداد الدوام",
        heroTitle: "إعداد الحضور والورديات",
        heroText: "أدر مواقع العمل وجداول الدوام، واربط كل موظف بالوردية المناسبة له دون المساس بالسجلات التاريخية.",
        chips: ["مواقع العمل", "ورديات مرنة", "إسناد بتواريخ"],
        tabs: { locations: "مواقع العمل", shifts: "الورديات", assignments: "إسناد الورديات" },
        statLoc: "مواقع فعالة", statLocNote: "من إجمالي المواقع المسجلة",
        statShift: "ورديات فعالة", statShiftNote: "من إجمالي الورديات المسجلة",
        statAsg: "إسنادات سارية اليوم", statAsgNote: "موظفون لديهم وردية الآن",
        statNoShift: "بلا وردية اليوم", statNoShiftNote: "أعضاء لم تُسند لهم وردية",
        name: "الاسم", tz: "المنطقة الزمنية", lat: "خط العرض", lng: "خط الطول", radius: "النطاق (متر)",
        geoReq: "اشتراط التحقق الجغرافي", remote: "السماح بالعمل عن بُعد",
        add: "إضافة", saving: "جارٍ الحفظ...", active: "فعّال", inactive: "معطّل", toggle: "تفعيل/تعطيل",
        start: "بداية الدوام", end: "نهاية الدوام", days: "أيام العمل",
        grace: "سماح التأخير (د)", brk: "الاستراحة (د)", early: "الحضور المبكر (د)",
        location: "الموقع", none: "بدون موقع", saved: "تم الحفظ بنجاح.", loading: "جارٍ التحميل...",
        loadingTitle: "جارٍ تحميل إعدادات الدوام", loadingText: "يتم جلب المواقع والورديات والإسنادات.",
        employees: "الموظفون", shift: "الوردية", from: "من تاريخ", to: "إلى تاريخ (اختياري)",
        assign: "إسناد الوردية", endNow: "إنهاء اليوم", open: "مفتوح", night: "ليلية",
        hist: "لتغيير أوقات وردية عليها سجلات سابقة: أنشئ وردية جديدة وأسندها من تاريخ مستقبلي. تغيير الاسم والتفعيل مسموح دائمًا.",
        addNewLoc: "إضافة موقع جديد", locList: "المواقع المسجلة", locEmpty: "لا توجد مواقع بعد.",
        addNewShift: "إنشاء وردية جديدة", editShift: "تعديل الوردية", updateShift: "تحديث الوردية",
        cancelEdit: "إلغاء التعديل", noChanges: "لا توجد تغييرات للحفظ.", edit: "تعديل",
        shiftList: "الورديات المسجلة", shiftEmpty: "لا توجد ورديات بعد.",
        newAssign: "إسناد جديد", history: "سجل الإسنادات", asgEmpty: "لا توجد إسنادات بعد.",
        selectAll: "تحديد الكل", selected: "محدد", searchEmp: "ابحث عن موظف", noMembers: "لا يوجد موظفون مطابقون.",
        chooseShift: "اختر الوردية", ended: "منتهٍ", current: "ساري", upcoming: "قادم",
        radiusShort: "م", geofence: "نطاق جغرافي",
        reqField: "هذا الحقل مطلوب", fillAll: "أكمل جميع بيانات الموقع قبل الحفظ.",
        badLat: "خط العرض بين -90 و 90", badLng: "خط الطول بين -180 و 180", badRadius: "النطاق رقم صحيح بين 10 و 50000",
        incompleteLoc: "بيانات ناقصة", incompleteHint: "أكمل بيانات هذا الموقع قبل تفعيله.",
      }
    : {
        badge: "ATTENDANCE", badgeSub: "Attendance setup",
        heroTitle: "Attendance & Shifts Setup",
        heroText: "Manage work locations and schedules, and link each employee to the right shift without touching historical records.",
        chips: ["Work locations", "Flexible shifts", "Dated assignments"],
        tabs: { locations: "Work Locations", shifts: "Shifts", assignments: "Shift Assignments" },
        statLoc: "Active locations", statLocNote: "Out of all registered locations",
        statShift: "Active shifts", statShiftNote: "Out of all registered shifts",
        statAsg: "Assignments active today", statAsgNote: "Employees with a shift now",
        statNoShift: "No shift today", statNoShiftNote: "Members without an assigned shift",
        name: "Name", tz: "Timezone", lat: "Latitude", lng: "Longitude", radius: "Radius (m)",
        geoReq: "Require geofence check", remote: "Allow remote work",
        add: "Add", saving: "Saving...", active: "Active", inactive: "Disabled", toggle: "Enable/disable",
        start: "Start time", end: "End time", days: "Work days",
        grace: "Late grace (min)", brk: "Break (min)", early: "Early check-in (min)",
        location: "Location", none: "No location", saved: "Saved successfully.", loading: "Loading...",
        loadingTitle: "Loading attendance setup", loadingText: "Fetching locations, shifts and assignments.",
        employees: "Employees", shift: "Shift", from: "From", to: "To (optional)",
        assign: "Assign shift", endNow: "End today", open: "Open", night: "Night",
        hist: "To change the times of a shift that has past records: create a new shift and assign it from a future date. Renaming and enabling/disabling are always allowed.",
        addNewLoc: "Add new location", locList: "Registered locations", locEmpty: "No locations yet.",
        addNewShift: "Create new shift", editShift: "Edit shift", updateShift: "Update shift",
        cancelEdit: "Cancel edit", noChanges: "No changes to save.", edit: "Edit",
        shiftList: "Registered shifts", shiftEmpty: "No shifts yet.",
        newAssign: "New assignment", history: "Assignment history", asgEmpty: "No assignments yet.",
        selectAll: "Select all", selected: "selected", searchEmp: "Search employee", noMembers: "No matching employees.",
        chooseShift: "Choose a shift", ended: "Ended", current: "Current", upcoming: "Upcoming",
        radiusShort: "m", geofence: "Geofence",
        reqField: "This field is required", fillAll: "Complete all location data before saving.",
        badLat: "Latitude must be between -90 and 90", badLng: "Longitude must be between -180 and 180", badRadius: "Radius must be a whole number between 10 and 50000",
        incompleteLoc: "Incomplete data", incompleteHint: "Complete this location's data before enabling it.",
      };

  const [tab, setTab] = useState<Tab>("locations");
  const [locs, setLocs] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [asg, setAsg] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const [editingShift, setEditingShift] = useState<any | null>(null);
  const [memberSearch, setMemberSearch] = useState("");

  const [lf, setLf] = useState({
    name: "", timezone: "Asia/Riyadh", latitude: "", longitude: "", radiusM: "",
    geofenceRequired: false, remoteAllowed: false,
  });
  const [sf, setSf] = useState({ ...EMPTY_SHIFT });
  const [af, setAf] = useState({
    userIds: [] as string[], shiftId: "", locationId: "", effectiveFrom: todayKey(), effectiveTo: "",
  });
  const [lfTouched, setLfTouched] = useState(false);

  const load = useCallback(async () => {
    try {
      const [l, s, a] = await Promise.all([
        api("/api/attendance/locations"),
        api("/api/attendance/shifts"),
        api("/api/attendance/assignments"),
      ]);
      setLocs(l.data ?? []);
      setShifts(s.data ?? []);
      setAsg(a.data ?? []);
      setMembers(a.members ?? []);
    } catch (e) {
      setMsg({ kind: "error", text: e instanceof Error ? e.message : "Error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function send(url: string, method: string, body: unknown, after?: () => void) {
    setBusy(true);
    setMsg(null);
    try {
      await api(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      setMsg({ kind: "ok", text: copy.saved });
      after?.();
      await load();
    } catch (e) {
      setMsg({ kind: "error", text: e instanceof Error ? e.message : "Error" });
    } finally {
      setBusy(false);
    }
  }

  const num = (v: string) => (v.trim() === "" ? null : Number(v));
  const names = dayNames(isArabic);
  
  const latN = Number(lf.latitude);
  const lngN = Number(lf.longitude);
  const radN = Number(lf.radiusM);
  const lfErrors = {
    name: !lf.name.trim() ? copy.reqField : "",
    timezone: !lf.timezone.trim() ? copy.reqField : "",
    latitude:
      lf.latitude.trim() === "" ? copy.reqField
      : !Number.isFinite(latN) || latN < -90 || latN > 90 ? copy.badLat : "",
    longitude:
      lf.longitude.trim() === "" ? copy.reqField
      : !Number.isFinite(lngN) || lngN < -180 || lngN > 180 ? copy.badLng : "",
    radiusM:
      lf.radiusM.trim() === "" ? copy.reqField
      : !Number.isInteger(radN) || radN < 10 || radN > 50000 ? copy.badRadius : "",
  };
  const lfValid = !Object.values(lfErrors).some(Boolean);
  const showErr = (k: keyof typeof lfErrors) => (lfTouched && lfErrors[k] ? lfErrors[k] : "");
  const errInput = (k: keyof typeof lfErrors) =>
    `${inputCls}${showErr(k) ? " !border-rose-400 focus:!border-rose-500" : ""}`;

  const isLocComplete = (l: any) =>
    l.latitude !== null && l.longitude !== null && l.geofence_radius_m !== null;

  const today = todayKey();

  const locName = (id: string | null) => locs.find((l) => l.id === id)?.name ?? copy.none;
  const shiftName = (id: string) => shifts.find((s) => s.id === id)?.name ?? id;
  const memberName = (id: string) => members.find((m) => m.userId === id)?.name ?? id;

  const isActiveToday = (a: any) => a.effective_from <= today && (a.effective_to === null || a.effective_to >= today);

  const stats = useMemo(() => {
    const activeUsers = new Set(asg.filter(isActiveToday).map((a) => a.user_id as string));
    return [
      { code: "LOC", label: copy.statLoc, value: locs.filter((l) => l.is_active).length, note: `${copy.statLocNote} (${locs.length})` },
      { code: "SHF", label: copy.statShift, value: shifts.filter((s) => s.is_active).length, note: `${copy.statShiftNote} (${shifts.length})` },
      { code: "ASG", label: copy.statAsg, value: activeUsers.size, note: copy.statAsgNote },
      { code: "EMP", label: copy.statNoShift, value: members.filter((m) => !activeUsers.has(m.userId)).length, note: copy.statNoShiftNote },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locs, shifts, asg, members, isArabic]);

  const visibleMembers = useMemo(() => {
    const q = memberSearch.trim().toLocaleLowerCase(isArabic ? "ar" : "en");
    return members.filter((m) => !q || String(m.name ?? "").toLocaleLowerCase(isArabic ? "ar" : "en").includes(q));
  }, [members, memberSearch, isArabic]);

  const allVisibleSelected =
    visibleMembers.length > 0 && visibleMembers.every((m) => af.userIds.includes(m.userId));

  function toggleAllVisible(checked: boolean) {
    const ids = new Set(af.userIds);
    for (const m of visibleMembers) {
      if (checked) ids.add(m.userId);
      else ids.delete(m.userId);
    }
    setAf({ ...af, userIds: [...ids] });
  }

  function resetShiftForm() {
    setSf({ ...EMPTY_SHIFT });
    setEditingShift(null);
  }

  function startEditShift(s: any) {
    setEditingShift(s);
    setSf({
      name: s.name,
      startTime: s.start_time.slice(0, 5),
      endTime: s.end_time.slice(0, 5),
      workDays: [...s.work_days],
      graceMinutes: s.grace_minutes,
      breakMinutes: s.break_minutes,
      earlyCheckinMinutes: s.early_checkin_minutes,
      locationId: s.location_id || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const shiftChanges = useMemo(() => {
    if (!editingShift) return null;
    const s = editingShift;
    const c: Record<string, unknown> = {};
    if (sf.name.trim() !== s.name) c.name = sf.name.trim();
    if (sf.startTime !== s.start_time.slice(0, 5)) c.startTime = sf.startTime;
    if (sf.endTime !== s.end_time.slice(0, 5)) c.endTime = sf.endTime;
    if (!sameDays(sf.workDays, s.work_days)) c.workDays = sf.workDays;
    if (sf.graceMinutes !== s.grace_minutes) c.graceMinutes = sf.graceMinutes;
    if (sf.breakMinutes !== s.break_minutes) c.breakMinutes = sf.breakMinutes;
    if (sf.earlyCheckinMinutes !== s.early_checkin_minutes) c.earlyCheckinMinutes = sf.earlyCheckinMinutes;
    if ((sf.locationId || null) !== (s.location_id ?? null)) c.locationId = sf.locationId || null;
    return c;
  }, [editingShift, sf]);

  const asgState = (a: any) =>
    a.effective_to !== null && a.effective_to < today ? "ended" : a.effective_from > today ? "upcoming" : "current";

  const badge = (on: boolean) =>
    `inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-black ${
      on ? "bg-emerald-100 text-emerald-800" : "bg-[var(--surface-muted)] text-[var(--text-secondary)]"
    }`;

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-[calc(100vh-64px)] bg-[var(--background)] px-4 py-5 text-[var(--text-primary)] sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-[1540px]">
        {/* ------------------------------ Hero ------------------------------ */}
        <section className="relative overflow-hidden rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
          <div className="absolute inset-y-0 start-0 w-1 bg-[var(--brand-primary)]" />
          <div className="px-6 py-7 md:px-8 lg:py-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--brand-subtle)] px-3 py-1.5 text-[11px] font-black text-[var(--brand-primary)]">
                <span className="h-2 w-2 rounded-full bg-[var(--brand-primary)]" />
                {copy.badge}
              </span>
              <span className="rounded-full border border-[var(--border-default)] bg-[var(--surface-muted)] px-3 py-1.5 text-[11px] font-bold text-[var(--text-secondary)]">
                {copy.badgeSub}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">{copy.heroTitle}</h1>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--text-secondary)] md:text-base md:leading-8">
              {copy.heroText}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {copy.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs font-bold text-[var(--text-secondary)]"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------ Stats ------------------------------ */}
        {!loading && (
          <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((card) => (
              <article
                key={card.code}
                className="group relative overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:shadow-[var(--shadow-medium)]"
              >
                <div className="absolute inset-x-0 top-0 h-0.5 origin-start scale-x-0 bg-[var(--brand-primary)] transition-transform duration-200 group-hover:scale-x-100" />
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-black text-[var(--text-muted)]">{card.label}</p>
                    <h2 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">{card.value}</h2>
                  </div>
                  <span className="flex h-9 min-w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface-muted)] px-2 text-[10px] font-black text-[var(--brand-primary)]">
                    {card.code}
                  </span>
                </div>
                <div className="mt-4 border-t border-[var(--border-default)] pt-3">
                  <p className="text-[11px] font-bold text-[var(--text-secondary)]">{card.note}</p>
                </div>
              </article>
            ))}
          </section>
        )}

        {/* ------------------------------- Tabs ------------------------------- */}
        <div className="mt-5 flex flex-wrap gap-2">
          {(Object.keys(copy.tabs) as Tab[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => { setTab(k); setMsg(null); }}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-black transition ${
                tab === k
                  ? "bg-[var(--brand-primary)] text-white shadow-sm"
                  : "border border-[var(--border-default)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)]"
              }`}
            >
              {k === "locations" && <MapPin size={16} />}
              {k === "shifts" && <Clock size={16} />}
              {k === "assignments" && <UserCheck size={16} />}
              {copy.tabs[k]}
            </button>
          ))}
        </div>

        <div className="mt-4">{msg && <Banner kind={msg.kind}>{msg.text}</Banner>}</div>

        {loading && (
          <section className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow-small)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-subtle)]">
              <span className="h-5 w-5 animate-pulse rounded-full bg-[var(--brand-primary)]" />
            </div>
            <p className="mt-4 text-base font-black">{copy.loadingTitle}</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{copy.loadingText}</p>
          </section>
        )}

        {/* ============================ Locations ============================ */}
        {!loading && tab === "locations" && (
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
             <section className={panelCls}>
              <div className={panelHeadCls}>
                <h2 className="flex items-center gap-2 text-sm font-black">
                  <Plus size={16} className="text-[var(--brand-primary)]" /> {copy.addNewLoc}
                </h2>
              </div>
              <div className="space-y-4 p-5">
                <label className={labelCls}>
                  {copy.name}
                  <input
                    className={errInput("name")}
                    value={lf.name}
                    onChange={(e) => setLf({ ...lf, name: e.target.value })}
                  />
                  {showErr("name") && <span className="mt-1 block text-[11px] font-black text-rose-600">{showErr("name")}</span>}
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={labelCls}>
                    {copy.lat}
                    <input
                      dir="ltr"
                      className={errInput("latitude")}
                      placeholder="24.7136"
                      value={lf.latitude}
                      onChange={(e) => setLf({ ...lf, latitude: e.target.value })}
                    />
                    {showErr("latitude") && <span className="mt-1 block text-[11px] font-black text-rose-600">{showErr("latitude")}</span>}
                  </label>
                  <label className={labelCls}>
                    {copy.lng} 
                    <input
                      dir="ltr"
                      className={errInput("longitude")}
                      placeholder="46.6753"
                      value={lf.longitude}
                      onChange={(e) => setLf({ ...lf, longitude: e.target.value })}
                    />
                    {showErr("longitude") && <span className="mt-1 block text-[11px] font-black text-rose-600">{showErr("longitude")}</span>}
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={labelCls}>
                    {copy.radius}
                    <input
                      type="number"
                      min={10}
                      className={errInput("radiusM")}
                      placeholder="150"
                      value={lf.radiusM}
                      onChange={(e) => setLf({ ...lf, radiusM: e.target.value })}
                    />
                    {showErr("radiusM") && <span className="mt-1 block text-[11px] font-black text-rose-600">{showErr("radiusM")}</span>}
                  </label>
                  <label className={labelCls}>
                    {copy.tz}
                    <input
                      dir="ltr"
                      className={errInput("timezone")}
                      value={lf.timezone}
                      onChange={(e) => setLf({ ...lf, timezone: e.target.value })}
                    />
                    {showErr("timezone") && <span className="mt-1 block text-[11px] font-black text-rose-600">{showErr("timezone")}</span>}
                  </label>
                </div>

                <div className="space-y-3 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4">
                  <label className="flex cursor-pointer items-center gap-3 text-sm font-bold text-[var(--text-secondary)]">
                    <input type="checkbox" className="h-4 w-4 accent-[var(--brand-primary)]" checked={lf.geofenceRequired} onChange={(e) => setLf({ ...lf, geofenceRequired: e.target.checked })} />
                    {copy.geoReq}
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 text-sm font-bold text-[var(--text-secondary)]">
                    <input type="checkbox" className="h-4 w-4 accent-[var(--brand-primary)]" checked={lf.remoteAllowed} onChange={(e) => setLf({ ...lf, remoteAllowed: e.target.checked })} />
                    {copy.remote}
                  </label>
                </div>

                {lfTouched && !lfValid && (
                  <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-black text-rose-700">
                    {copy.fillAll}
                  </div>
                )}

                <button
                  type="button"
                  className={`${primaryBtn} w-full`}
                  disabled={busy}
                  onClick={() => {
                    if (!lfValid) {
                      setLfTouched(true);
                      return;
                    }
                    void send(
                      "/api/attendance/locations", "POST",
                      {
                        ...lf,
                        name: lf.name.trim(),
                        timezone: lf.timezone.trim(),
                        latitude: latN,
                        longitude: lngN,
                        radiusM: radN,
                      },
                      () => {
                        setLf({ ...lf, name: "", latitude: "", longitude: "", radiusM: "" });
                        setLfTouched(false);
                      },
                    );
                  }}
                >
                  <Save size={16} /> {busy ? copy.saving : copy.add}
                </button>
              </div>
            </section>

            <section className={panelCls}>
              <div className={panelHeadCls}>
                <h2 className="text-sm font-black">{copy.locList}</h2>
                <span className="rounded-full bg-[var(--brand-subtle)] px-2.5 py-1 text-[11px] font-black text-[var(--brand-primary)]">{locs.length}</span>
              </div>
              <ul className="divide-y divide-[var(--border-default)]">
                {locs.map((l) => (
                  <li key={l.id} className="flex flex-col gap-3 px-5 py-4 transition hover:bg-[var(--surface-muted)] sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="flex items-center gap-2 font-black">
                        <MapIcon size={16} className="shrink-0 text-[var(--brand-primary)]" />
                        <span className="truncate">{l.name}</span>
                      </h3>
                      <div className="mt-1.5 flex flex-wrap gap-2 text-[11px] font-bold text-[var(--text-secondary)]">
                        <span dir="ltr" className="rounded-md bg-[var(--surface-muted)] px-2 py-1">{l.timezone}</span>
                        {l.geofence_required && (
                          <span className="rounded-md bg-emerald-50 px-2 py-1 text-emerald-700">
                            {copy.geofence}: {l.geofence_radius_m}{copy.radiusShort}
                          </span>
                        )}
                        {!isLocComplete(l) && (
                          <span className="rounded-md bg-amber-100 px-2 py-1 text-amber-800">{copy.incompleteLoc}</span>
                        )}
                        {l.remote_allowed && (
                          <span className="rounded-md bg-blue-50 px-2 py-1 text-blue-700">{copy.remote}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={badge(l.is_active)}>{l.is_active ? copy.active : copy.inactive}</span>
                      <button
                        type="button"
                        title={!l.is_active && !isLocComplete(l) ? copy.incompleteHint : copy.toggle}
                        aria-label={copy.toggle}
                        className={iconBtn}
                        disabled={busy || (!l.is_active && !isLocComplete(l))}
                        onClick={() => void send("/api/attendance/locations", "PATCH", { id: l.id, isActive: !l.is_active })}
                      >
                        {l.is_active ? <PowerOff size={15} className="text-rose-600" /> : <Power size={15} className="text-emerald-600" />}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              {locs.length === 0 && (
                <div className="px-4 py-14 text-center text-sm font-bold text-[var(--text-secondary)]">{copy.locEmpty}</div>
              )}
            </section>
          </div>
        )}

        {/* ============================== Shifts ============================== */}
        {!loading && tab === "shifts" && (
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
            <section className={panelCls}>
              <div className={panelHeadCls}>
                <h2 className="flex items-center gap-2 text-sm font-black">
                  {editingShift ? (
                    <Edit size={16} className="text-[var(--brand-primary)]" />
                  ) : (
                    <Plus size={16} className="text-[var(--brand-primary)]" />
                  )}
                  {editingShift ? copy.editShift : copy.addNewShift}
                </h2>
                {editingShift && (
                  <button type="button" className={iconBtn} onClick={resetShiftForm}>
                    <X size={14} /> {copy.cancelEdit}
                  </button>
                )}
              </div>

              <div className="space-y-4 p-5">
                <label className={labelCls}>
                  {copy.name}
                  <input className={inputCls} value={sf.name} onChange={(e) => setSf({ ...sf, name: e.target.value })} />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={labelCls}>
                    {copy.start}
                    <input type="time" dir="ltr" className={inputCls} value={sf.startTime} onChange={(e) => setSf({ ...sf, startTime: e.target.value })} />
                  </label>
                  <label className={labelCls}>
                    {copy.end}
                    <input type="time" dir="ltr" className={inputCls} value={sf.endTime} onChange={(e) => setSf({ ...sf, endTime: e.target.value })} />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className={labelCls}>
                    {copy.grace}
                    <input type="number" min={0} className={inputCls} value={sf.graceMinutes} onChange={(e) => setSf({ ...sf, graceMinutes: Number(e.target.value) })} />
                  </label>
                  <label className={labelCls}>
                    {copy.brk}
                    <input type="number" min={0} className={inputCls} value={sf.breakMinutes} onChange={(e) => setSf({ ...sf, breakMinutes: Number(e.target.value) })} />
                  </label>
                  <label className={labelCls}>
                    {copy.early}
                    <input type="number" min={0} className={inputCls} value={sf.earlyCheckinMinutes} onChange={(e) => setSf({ ...sf, earlyCheckinMinutes: Number(e.target.value) })} />
                  </label>
                </div>
                <label className={labelCls}>
                  {copy.location}
                  <select className={inputCls} value={sf.locationId} onChange={(e) => setSf({ ...sf, locationId: e.target.value })}>
                    <option value="">{copy.none}</option>
                    {locs.filter((l) => l.is_active || l.id === sf.locationId).map((l) => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </label>

                <div>
                  <p className={`${labelCls} mb-2`}>{copy.days}</p>
                  <div className="flex flex-wrap gap-2">
                    {names.map((n, i) => {
                      const on = sf.workDays.includes(i);
                      return (
                        <label
                          key={i}
                          className={`cursor-pointer rounded-lg border px-3 py-2 text-xs font-black transition ${
                            on
                              ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white shadow-sm"
                              : "border-[var(--border-default)] bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={on}
                            onChange={(e) =>
                              setSf({ ...sf, workDays: e.target.checked ? [...sf.workDays, i] : sf.workDays.filter((d) => d !== i) })
                            }
                          />
                          {n}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  className={`${primaryBtn} w-full`}
                  disabled={
                    busy || !sf.name.trim() || sf.workDays.length === 0 ||
                    (editingShift !== null && Object.keys(shiftChanges ?? {}).length === 0)
                  }
                  onClick={() => {
                    if (editingShift) {
                      void send("/api/attendance/shifts", "PATCH", { id: editingShift.id, ...shiftChanges }, resetShiftForm);
                    } else {
                      void send("/api/attendance/shifts", "POST", { ...sf, locationId: sf.locationId || null }, resetShiftForm);
                    }
                  }}
                >
                  <Save size={16} /> {busy ? copy.saving : editingShift ? copy.updateShift : copy.add}
                </button>

                {editingShift && Object.keys(shiftChanges ?? {}).length === 0 && (
                  <p className="text-center text-[11px] font-bold text-[var(--text-muted)]">{copy.noChanges}</p>
                )}
                <p className="text-[11px] font-bold leading-6 text-[var(--text-muted)]">{copy.hist}</p>
              </div>
            </section>

            <section className={panelCls}>
              <div className={panelHeadCls}>
                <h2 className="text-sm font-black">{copy.shiftList}</h2>
                <span className="rounded-full bg-[var(--brand-subtle)] px-2.5 py-1 text-[11px] font-black text-[var(--brand-primary)]">{shifts.length}</span>
              </div>
              <ul className="divide-y divide-[var(--border-default)]">
                {shifts.map((s) => (
                  <li
                    key={s.id}
                    className={`flex flex-col gap-3 px-5 py-4 transition hover:bg-[var(--surface-muted)] sm:flex-row sm:items-center sm:justify-between ${
                      editingShift?.id === s.id ? "bg-[var(--brand-subtle)]" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className="flex flex-wrap items-center gap-2 font-black">
                        <Clock size={16} className="shrink-0 text-[var(--brand-primary)]" />
                        <span className="truncate">{s.name}</span>
                        {s.crosses_midnight && (
                          <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-black text-indigo-700">{copy.night}</span>
                        )}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold text-[var(--text-secondary)]">
                        <span dir="ltr" className="rounded-md bg-[var(--surface-muted)] px-2 py-1 font-black text-[var(--text-primary)]">
                          {s.start_time.slice(0, 5)} → {s.end_time.slice(0, 5)}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md bg-[var(--surface-muted)] px-2 py-1">
                          <MapPin size={11} /> {locName(s.location_id)}
                        </span>
                        <span className="rounded-md bg-[var(--surface-muted)] px-2 py-1">
                          {(s.work_days as number[]).map((d) => names[d]).join("، ")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={badge(s.is_active)}>{s.is_active ? copy.active : copy.inactive}</span>
                      <button type="button" title={copy.edit} aria-label={copy.edit} className={iconBtn} disabled={busy} onClick={() => startEditShift(s)}>
                        <Edit size={15} className="text-[var(--brand-primary)]" />
                      </button>
                      <button
                        type="button"
                        title={copy.toggle}
                        aria-label={copy.toggle}
                        className={iconBtn}
                        disabled={busy}
                        onClick={() => void send("/api/attendance/shifts", "PATCH", { id: s.id, isActive: !s.is_active })}
                      >
                        {s.is_active ? <PowerOff size={15} className="text-rose-600" /> : <Power size={15} className="text-emerald-600" />}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              {shifts.length === 0 && (
                <div className="px-4 py-14 text-center text-sm font-bold text-[var(--text-secondary)]">{copy.shiftEmpty}</div>
              )}
            </section>
          </div>
        )}

        {/* =========================== Assignments =========================== */}
        {!loading && tab === "assignments" && (
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
            <section className={panelCls}>
              <div className={panelHeadCls}>
                <h2 className="flex items-center gap-2 text-sm font-black">
                  <UserCheck size={16} className="text-[var(--brand-primary)]" /> {copy.newAssign}
                </h2>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <p className={labelCls}>{copy.employees}</p>
                    <div className="flex items-center gap-3">
                      <label className="flex cursor-pointer items-center gap-2 text-xs font-black text-[var(--text-secondary)]">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-[var(--brand-primary)]"
                          checked={allVisibleSelected}
                          onChange={(e) => toggleAllVisible(e.target.checked)}
                        />
                        {copy.selectAll}
                      </label>
                      <span className="rounded-full bg-[var(--brand-subtle)] px-2.5 py-1 text-[11px] font-black text-[var(--brand-primary)]">
                        {af.userIds.length} / {members.length} {copy.selected}
                      </span>
                    </div>
                  </div>

                  <input
                    type="search"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    placeholder={copy.searchEmp}
                    className={`${inputCls} mt-0 mb-2`}
                  />

                  <div className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-3 sm:grid-cols-2">
                    {visibleMembers.map((m) => {
                      const on = af.userIds.includes(m.userId);
                      return (
                        <label
                          key={m.userId}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-bold transition ${
                            on
                              ? "border-[var(--brand-primary)] bg-[var(--brand-subtle)] text-[var(--brand-primary)]"
                              : "border-[var(--border-default)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-[var(--brand-primary)]"
                            checked={on}
                            onChange={(e) =>
                              setAf({ ...af, userIds: e.target.checked ? [...af.userIds, m.userId] : af.userIds.filter((u) => u !== m.userId) })
                            }
                          />
                          <span className="truncate">{m.name}</span>
                        </label>
                      );
                    })}
                    {visibleMembers.length === 0 && (
                      <p className="col-span-full py-6 text-center text-xs font-bold text-[var(--text-secondary)]">{copy.noMembers}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={labelCls}>
                    {copy.shift}
                    <select className={inputCls} value={af.shiftId} onChange={(e) => setAf({ ...af, shiftId: e.target.value })}>
                      <option value="" disabled>{copy.chooseShift}</option>
                      {shifts.filter((s) => s.is_active).map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className={labelCls}>
                    {copy.location}
                    <select className={inputCls} value={af.locationId} onChange={(e) => setAf({ ...af, locationId: e.target.value })}>
                      <option value="">{copy.none}</option>
                      {locs.filter((l) => l.is_active).map((l) => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className={labelCls}>
                    {copy.from}
                    <input type="date" dir="ltr" min={today} className={inputCls} value={af.effectiveFrom} onChange={(e) => setAf({ ...af, effectiveFrom: e.target.value })} />
                  </label>
                  <label className={labelCls}>
                    {copy.to}
                    <input type="date" dir="ltr" min={af.effectiveFrom} className={inputCls} value={af.effectiveTo} onChange={(e) => setAf({ ...af, effectiveTo: e.target.value })} />
                  </label>
                </div>

                <button
                  type="button"
                  className={`${primaryBtn} w-full`}
                  disabled={busy || !af.shiftId || af.userIds.length === 0}
                  onClick={() =>
                    void send(
                      "/api/attendance/assignments", "POST",
                      { ...af, locationId: af.locationId || null, effectiveTo: af.effectiveTo || null },
                      () => setAf({ ...af, userIds: [] }),
                    )
                  }
                >
                  <Check size={16} /> {busy ? copy.saving : copy.assign}
                </button>
              </div>
            </section>

            <section className={panelCls}>
              <div className={panelHeadCls}>
                <h2 className="text-sm font-black">{copy.history}</h2>
                <span className="rounded-full bg-[var(--brand-subtle)] px-2.5 py-1 text-[11px] font-black text-[var(--brand-primary)]">{asg.length}</span>
              </div>
              <ul className="divide-y divide-[var(--border-default)]">
                {asg.map((a) => {
                  const st = asgState(a);
                  return (
                    <li
                      key={a.id}
                      className={`flex flex-col gap-3 px-5 py-4 transition hover:bg-[var(--surface-muted)] sm:flex-row sm:items-center sm:justify-between ${
                        st === "ended" ? "opacity-60" : ""
                      }`}
                    >
                      <div className="min-w-0">
                        <h3 className="flex items-center gap-2 font-black">
                          <Users size={16} className="shrink-0 text-[var(--brand-primary)]" />
                          <span className="truncate">{memberName(a.user_id)}</span>
                        </h3>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] font-bold text-[var(--text-secondary)]">
                          <span className="rounded-md bg-[var(--brand-subtle)] px-2 py-1 font-black text-[var(--brand-primary)]">{shiftName(a.shift_id)}</span>
                          <span dir="ltr" className="rounded-md bg-[var(--surface-muted)] px-2 py-1">
                            {a.effective_from} → {a.effective_to ?? copy.open}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={badge(st === "current")}>
                          {st === "current" ? copy.current : st === "upcoming" ? copy.upcoming : copy.ended}
                        </span>
                        {(a.effective_to === null || a.effective_to > today) && (
                          <button
                            type="button"
                            className={`${iconBtn} text-rose-600 hover:border-rose-300 hover:bg-rose-50`}
                            disabled={busy}
                            onClick={() =>
                              void send("/api/attendance/assignments", "PATCH", {
                                id: a.id,
                                effectiveTo: a.effective_from > today ? a.effective_from : shiftDate(today, 0),
                              })
                            }
                          >
                            {copy.endNow}
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
              {asg.length === 0 && (
                <div className="px-4 py-14 text-center text-sm font-bold text-[var(--text-secondary)]">{copy.asgEmpty}</div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}