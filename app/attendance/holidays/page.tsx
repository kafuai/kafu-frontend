"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarDays, Check, Trash2 } from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { api, Banner, todayKey } from "@/components/attendance/shared";

type Member = { userId: string; name: string; role: string; payrollEligible: boolean; basicSalary: number | string | null };
type Holiday = { id: string; name: string; start_date: string; end_date: string };
type HolidayAssignment = { id: string; holiday_period_id: string; user_id: string; overtime_enabled: boolean; overtime_calculation_type: "percentage" | "fixed_daily"; overtime_percentage: number | string; overtime_fixed_daily_amount: number | string };
type EmployeeSetting = { selected: boolean; overtimeEnabled: boolean; overtimeMode: "percentage" | "fixed_daily"; overtimeValue: string };

const inputClass = "mt-1 h-11 w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)]";
const buttonClass = "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 text-sm font-black text-white disabled:opacity-50";

export default function OfficialHolidaysPage() {
  const { locale } = useLocalization();
  const ar = locale === "ar";
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [holidayAssignments, setHolidayAssignments] = useState<HolidayAssignment[]>([]);
  const [settings, setSettings] = useState<Record<string, EmployeeSetting>>({});
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(todayKey());
  const [endDate, setEndDate] = useState(todayKey());
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const copy = ar ? {
    title: "العطل الرسمية والعمل الإضافي", intro: "أنشئ عطلة وحدد الموظفين المسموح لهم بالعمل. إعدادات النسبة إدارية ولا تظهر للموظف.",
    name: "اسم العطلة", start: "من تاريخ", end: "إلى تاريخ", employees: "الموظفون المسموح لهم بالعمل", search: "ابحث عن موظف",
    selected: "محدد", overtime: "احتساب العمل الإضافي", percentage: "نسبة زيادة على الأجر اليومي (%)", fixedDaily: "مبلغ إضافي ثابت لكل يوم (ريال)", mode: "طريقة حساب الإضافي", dailyBasic: "الأجر اليومي الأساسي", dailyExtra: "الزيادة اليومية", dailyWithExtra: "الأجر اليومي بعد الزيادة", create: "حفظ العطلة", saving: "جارٍ الحفظ...",
    overtimeHelpTitle: "كيف تُحسب الزيادة اليومية؟", overtimeHelp: "الأجر اليومي الأساسي = الراتب الأساسي الشهري ÷ 30. عند اختيار نسبة، تُحسب الزيادة فقط من الأجر اليومي؛ مثال: راتب 15,000 ريال = 500 ريال يوميًا، ونسبة 15% = 75 ريالًا إضافيًا، فيصبح الأجر اليومي التوضيحي 575 ريالًا. عند اختيار مبلغ ثابت، مثل 75 ريالًا، تضاف 75 ريالًا عن كل يوم مؤهل. الإضافي يضاف إلى مسير الراتب كزيادة فقط، لأن الراتب الأساسي محسوب أصلًا. خصومات التأخير والغياب تبقى مستقلة وتُحسب حسب سياسة الحضور.",
    list: "العطل المسجلة", empty: "لا توجد عطل مسجلة.", delete: "حذف", loading: "جارٍ تحميل الإعدادات...", assigned: "موظف مسموح", overtimePeople: "احتساب إضافي:",
    required: "أدخل اسم العطلة وحدد المدة وموظفًا واحدًا على الأقل.", noOvertime: "بدون عمل إضافي", yesOvertime: "احتساب إضافي",
    saved: "تم حفظ العطلة وإسنادات الموظفين.", deleted: "تم حذف العطلة.", deleteConfirm: "هل تريد حذف هذه العطلة؟ لا يمكن حذف عطلة أُدرجت في مسير رواتب.",
    noEmployees: "لا يوجد موظفون مطابقون.", dateError: "تحقق من تاريخ البداية والنهاية.", payrollRequired: "يحتاج إلى ربط ببيانات الرواتب",
  } : {
    title: "Official Holidays & Overtime", intro: "Create a holiday and choose who is allowed to work. Overtime settings are administrative and are never shown to employees.",
    name: "Holiday name", start: "Start date", end: "End date", employees: "Employees allowed to work", search: "Search employees",
    selected: "selected", overtime: "Calculate overtime", percentage: "Percentage increase on daily pay (%)", fixedDaily: "Fixed extra amount per day (SAR)", mode: "Overtime calculation method", dailyBasic: "Basic daily pay", dailyExtra: "Daily increase", dailyWithExtra: "Daily pay after increase", create: "Save holiday", saving: "Saving...",
    overtimeHelpTitle: "How is the daily increase calculated?", overtimeHelp: "Basic daily pay = monthly basic salary ÷ 30. With percentage mode, the entered percentage is the extra amount only. Example: SAR 15,000 monthly salary = SAR 500 daily; 15% adds SAR 75, making the illustrative daily amount SAR 575. With fixed mode, entering SAR 75 adds SAR 75 per eligible day. Only the extra amount is added to payroll because the base salary is already included. Lateness and absence deductions remain separate and follow the attendance policy.",
    list: "Registered holidays", empty: "No holidays registered.", delete: "Delete", loading: "Loading settings...", assigned: "employees allowed", overtimePeople: "Overtime enabled:",
    required: "Enter a name, date range, and select at least one employee.", noOvertime: "No overtime", yesOvertime: "Overtime enabled",
    saved: "Holiday and employee assignments saved.", deleted: "Holiday deleted.", deleteConfirm: "Delete this holiday? A holiday already included in payroll cannot be deleted.",
    noEmployees: "No matching employees.", dateError: "Check the start and end dates.", payrollRequired: "Must be linked to an active payroll record",
  };

  const load = useCallback(async () => {
    try {
      const result = await api("/api/attendance/holidays");
      setHolidays(result.data ?? []);
      setMembers(result.members ?? []);
      setHolidayAssignments(result.assignments ?? []);
      setSettings((current) => {
        const next = { ...current };
        for (const m of result.members ?? []) next[m.userId] ??= { selected: false, overtimeEnabled: false, overtimeMode: "percentage", overtimeValue: "15" };
        return next;
      });
    } catch (e) {
      setMessage({ kind: "error", text: e instanceof Error ? e.message : "Unable to load settings." });
    } finally {
      setLoading(false);
    }
  }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load]);

  const visibleMembers = members.filter((m) => m.name.toLocaleLowerCase(ar ? "ar" : "en").includes(search.trim().toLocaleLowerCase(ar ? "ar" : "en")));
  const selectedCount = Object.values(settings).filter((s) => s.selected).length;
  const setEmployee = (id: string, patch: Partial<EmployeeSetting>) => setSettings((old) => ({ ...old, [id]: { ...(old[id] ?? { selected: false, overtimeEnabled: false, overtimeMode: "percentage", overtimeValue: "15" }), ...patch } }));

  async function createHoliday() {
    setMessage(null);
    if (!name.trim() || !startDate || !endDate || endDate < startDate || selectedCount === 0) {
      setMessage({ kind: "error", text: !startDate || !endDate || endDate < startDate ? copy.dateError : copy.required });
      return;
    }
    const employees = Object.entries(settings).filter(([, v]) => v.selected).map(([userId, v]) => ({
      userId, overtimeEnabled: v.overtimeEnabled,
      overtimeMode: v.overtimeMode, overtimeValue: v.overtimeEnabled ? Number(v.overtimeValue) : 0,
    }));
    if (employees.some((e) => e.overtimeEnabled && (!Number.isFinite(e.overtimeValue) || e.overtimeValue < 0 || (e.overtimeMode === "fixed_daily" && e.overtimeValue <= 0)))) {
      setMessage({ kind: "error", text: ar ? "أدخل قيمة صحيحة غير سالبة، ومبلغًا ثابتًا أكبر من صفر عند اختيار المبلغ الثابت." : "Enter a valid non-negative value; fixed daily amounts must be greater than zero." });
      return;
    }
    setBusy(true);
    try {
      await api("/api/attendance/holidays", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name.trim(), startDate, endDate, employees }) });
      setName("");
      setMessage({ kind: "ok", text: copy.saved });
      await load();
    } catch (e) {
      setMessage({ kind: "error", text: e instanceof Error ? e.message : "Unable to save holiday." });
    } finally { setBusy(false); }
  }

  async function deleteHoliday(holiday: Holiday) {
    if (!window.confirm(copy.deleteConfirm)) return;
    setBusy(true); setMessage(null);
    try {
      await api("/api/attendance/holidays", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: holiday.id }) });
      setMessage({ kind: "ok", text: copy.deleted });
      await load();
    } catch (e) {
      setMessage({ kind: "error", text: e instanceof Error ? e.message : "Unable to delete holiday." });
    } finally { setBusy(false); }
  }

  return <main dir={ar ? "rtl" : "ltr"} className="min-h-[calc(100vh-64px)] bg-[var(--background)] px-4 py-6 text-[var(--text-primary)] sm:px-6 lg:px-8">
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
        <div className="flex items-center gap-3"><span className="rounded-xl bg-[var(--brand-subtle)] p-3 text-[var(--brand-primary)]"><CalendarDays size={22} /></span><div><h1 className="text-2xl font-black">{copy.title}</h1><p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{copy.intro}</p></div></div>
      </header>
      {message && <Banner kind={message.kind}>{message.text}</Banner>}
      {loading ? <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-8 text-center">{copy.loading}</div> : <>
        <section className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)]">
          <h2 className="text-lg font-black">{copy.title}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <label className="text-xs font-black text-[var(--text-secondary)]">{copy.name}<input className={inputClass} maxLength={160} value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label className="text-xs font-black text-[var(--text-secondary)]">{copy.start}<input className={inputClass} type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); if (endDate < e.target.value) setEndDate(e.target.value); }} /></label>
            <label className="text-xs font-black text-[var(--text-secondary)]">{copy.end}<input className={inputClass} type="date" min={startDate} value={endDate} onChange={(e) => setEndDate(e.target.value)} /></label>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3"><h3 className="font-black">{copy.employees}</h3><span className="text-xs font-bold text-[var(--text-secondary)]">{selectedCount} {copy.selected}</span></div>
          <input className={`${inputClass} max-w-md`} placeholder={copy.search} value={search} onChange={(e) => setSearch(e.target.value)} />
          <aside className="mt-4 rounded-xl border border-[var(--border-default)] bg-[var(--background)] p-4" role="note" aria-label={copy.overtimeHelpTitle}>
            <p className="text-sm font-black">{copy.overtimeHelpTitle}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{copy.overtimeHelp}</p>
          </aside>
          <div className="mt-3 divide-y divide-[var(--border-default)] rounded-xl border border-[var(--border-default)]">
            {visibleMembers.length === 0 ? <p className="p-4 text-sm text-[var(--text-secondary)]">{copy.noEmployees}</p> : visibleMembers.map((m) => {
              const setting = settings[m.userId] ?? { selected: false, overtimeEnabled: false, overtimeMode: "percentage" as const, overtimeValue: "15" };
              const basicDaily = Number(m.basicSalary ?? 0) / 30;
              const overtimeValue = Number(setting.overtimeValue);
              const extraDaily = setting.overtimeMode === "percentage" ? basicDaily * (Number.isFinite(overtimeValue) ? overtimeValue : 0) / 100 : (Number.isFinite(overtimeValue) ? overtimeValue : 0);
              return <div key={m.userId} className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_auto_150px] md:items-center">
                <label className={`flex items-center gap-3 text-sm font-bold ${!m.payrollEligible ? "opacity-60" : ""}`}><input type="checkbox" disabled={!m.payrollEligible} checked={setting.selected} onChange={(e) => setEmployee(m.userId, { selected: e.target.checked })} /><span>{m.name}</span><span className="text-xs font-medium text-[var(--text-muted)]">{m.role}</span>{!m.payrollEligible && <span className="text-xs font-medium text-amber-700">{copy.payrollRequired}</span>}</label>
                {setting.selected ? <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)]"><input type="checkbox" checked={setting.overtimeEnabled} onChange={(e) => setEmployee(m.userId, { overtimeEnabled: e.target.checked })} />{copy.overtime}</label> : <span />}
                {setting.selected && setting.overtimeEnabled ? <div className="grid gap-2 md:col-span-3 md:grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)_minmax(220px,1.4fr)] md:items-end">
                  <label className="text-xs font-black text-[var(--text-secondary)]">{copy.mode}<select className={inputClass} value={setting.overtimeMode} onChange={(e) => setEmployee(m.userId, { overtimeMode: e.target.value as "percentage" | "fixed_daily" })}><option value="percentage">{copy.percentage}</option><option value="fixed_daily">{copy.fixedDaily}</option></select></label>
                  <label className="text-xs font-black text-[var(--text-secondary)]">{setting.overtimeMode === "percentage" ? copy.percentage : copy.fixedDaily}<input className={inputClass} type="number" min="0" step="0.01" value={setting.overtimeValue} onChange={(e) => setEmployee(m.userId, { overtimeValue: e.target.value })} /></label>
                  <div className="rounded-xl border border-[var(--border-default)] bg-[var(--background)] p-3 text-xs leading-5"><p>{copy.dailyBasic}: <strong>{basicDaily.toLocaleString(ar ? "ar-SA" : "en-US", { maximumFractionDigits: 2 })} {ar ? "ريال" : "SAR"}</strong></p><p>{copy.dailyExtra}: <strong>{extraDaily.toLocaleString(ar ? "ar-SA" : "en-US", { maximumFractionDigits: 2 })} {ar ? "ريال" : "SAR"}</strong></p><p className="mt-1">{copy.dailyWithExtra}: <strong>{(basicDaily + extraDaily).toLocaleString(ar ? "ar-SA" : "en-US", { maximumFractionDigits: 2 })} {ar ? "ريال" : "SAR"}</strong></p></div>
                </div> : setting.selected ? <span className="text-xs text-[var(--text-muted)]">{copy.noOvertime}</span> : null}
              </div>;
            })}
          </div>
          <button type="button" className={`${buttonClass} mt-5`} disabled={busy} onClick={() => void createHoliday()}><Check size={16} />{busy ? copy.saving : copy.create}</button>
        </section>
        <section className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)]">
          <h2 className="text-lg font-black">{copy.list}</h2>
          {!holidays.length ? <p className="mt-4 text-sm text-[var(--text-secondary)]">{copy.empty}</p> : <div className="mt-4 divide-y divide-[var(--border-default)]">{holidays.map((h) => <div key={h.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><p className="font-black">{h.name}</p><p className="mt-1 text-sm text-[var(--text-secondary)]">{h.start_date} — {h.end_date} · {holidayAssignments.filter((a) => a.holiday_period_id === h.id).length} {copy.assigned}</p>{holidayAssignments.some((a) => a.holiday_period_id === h.id && a.overtime_enabled) && <p className="mt-1 text-xs text-[var(--text-secondary)]">{copy.overtimePeople} {holidayAssignments.filter((a) => a.holiday_period_id === h.id && a.overtime_enabled).map((a) => `${members.find((m) => m.userId === a.user_id)?.name ?? a.user_id} (${a.overtime_calculation_type === "fixed_daily" ? `${Number(a.overtime_fixed_daily_amount)} SAR/day` : `${Number(a.overtime_percentage)}%`})`).join(", ")}</p>}</div><button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--border-default)] px-3 text-xs font-black text-[var(--text-secondary)] disabled:opacity-50" disabled={busy} onClick={() => void deleteHoliday(h)}><Trash2 size={14} />{copy.delete}</button></div>)}</div>}
        </section>
      </>}
    </div>
  </main>;
}
