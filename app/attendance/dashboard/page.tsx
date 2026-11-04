"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, LoaderCircle, RefreshCw } from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";
import {
  localizeErrorMessage, api, fmtMinutes, fmtMoney, fmtTime, shiftDate, StatusBadge, todayKey,
} from "@/components/attendance/shared";

/* ------------------------------- types ------------------------------- */

type DailyProposal = {
  id: string;
  incident_type: "late" | "early_leave" | "absence";
  status: string;
  original_amount: number | string | null;
  final_amount: number | string | null;
};

type DailyRow = {
  userId: string;
  name: string;
  employeeNumber: string | null;
  department: string | null;
  shiftName: string | null;
  timezone: string;
  status: string;
  checkIn: string | null;
  checkOut: string | null;
  lateMinutes: number;
  lateIsRunning: boolean;
  earlyLeaveMinutes: number;
  workedMinutes: number | null;
  dayId: string | null;
  proposals: DailyProposal[];
};

type MonthlyRow = {
  userId: string;
  name: string;
  employeeNumber: string | null;
  department: string | null;
  present: number;
  late: number;
  earlyLeave: number;
  possibleAbsence: number;
  absent: number;
  incomplete: number;
  onLeave: number;
  lateMinutes: number;
  workedMinutes: number;
  pendingProposals: number;
  approvedAmount: number;
};

/* ------------------------------ constants ------------------------------ */

const OPEN_PROPOSAL = ["needs_review", "in_review", "needs_extra_approval", "apply_failed"];

const STATUS_FILTERS = [
  "not_yet", "present", "late", "early_leave", "late_early_leave", "possible_absence",
  "absent_confirmed", "incomplete", "correction_pending", "on_leave", "holiday",
];

const post = (url: string, body: unknown) =>
  api(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

/* -------------------------------- page -------------------------------- */

export default function AttendanceDashboardPage() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";

  const copy = isArabic
    ? {
        badge: "ATTENDANCE", badgeSub: "لوحة الحضور",
        heroTitle: "لوحة الحضور والانصراف",
        heroText: "تابع حضور موظفيك يومًا بيوم، وراجع التأخير والخصومات المقترحة قبل أن تصل إلى الرواتب.",
        chips: ["يوم واحد", "تقييم تلقائي", "مراجعة الخصومات"],
        tabDaily: "اليومي", tabMonthly: "التقرير الشهري",
        date: "التاريخ", refresh: "تحديث", today: "اليوم", prevDay: "اليوم السابق", nextDay: "اليوم التالي",
        statTotal: "موظفون لديهم وردية", statTotalNote: "حسب الإسناد وأيام العمل",
        statIn: "سجّلوا حضورهم", statInNote: "لهم وقت حضور مسجّل",
        statLate: "متأخرون", statLateNote: "تأخير مسجّل أو جارٍ",
        statMissing: "لم يسجّلوا", statMissingNote: "لم يسجّلوا حضورًا أو غياب محتمل",
        statDed: "خصومات تنتظر القرار", statDedNote: "مقترحات مفتوحة",
        search: "ابحث بالاسم أو الرقم الوظيفي أو الإدارة", all: "كل الحالات",
        colName: "الموظف", colNumber: "الرقم الوظيفي", colDept: "الإدارة", colStatus: "الحالة",
        colIn: "وقت الحضور", colOut: "وقت الانصراف", colLate: "تأخير (د)", colEarly: "مبكر (د)", colDeduction: "الخصم",
        runningLate: "تأخير جارٍ: لم يسجّل حضوره بعد، ولا يُنشأ خصم قبل التقييم",
        awaitingAmount: "بانتظار تحديد المبلغ", confirmAbsence: "اعتماد الغياب",
        confirmQ: "تأكيد اعتبار هذا اليوم غيابًا وإنشاء مقترح خصم للمراجعة؟",
        empty: "لا يوجد موظفون لديهم وردية في هذا اليوم.", noMatch: "لا نتائج مطابقة.",
        loadingTitle: "جارٍ تحميل حضور اليوم", loadingText: "يتم تقييم اليوم وجلب سجلات الموظفين.",
        errorTitle: "تعذر تحميل الحضور", retry: "إعادة المحاولة",
        evalWarn: "تعذر تقييم اليوم، تُعرض الحالة المباشرة فقط: ",
        incident: { late: "تأخير", early_leave: "مبكر", absence: "غياب" } as Record<string, string>,
        month: "الشهر", generate: "إنشاء التقرير", generating: "جارٍ إنشاء التقرير...",
        monthHint: "يُقيَّم الشهر كاملًا (حتى اليوم) ثم يُعرض الملخص.",
        futureMonth: "لا يمكن إنشاء تقرير لشهر مستقبلي.",
        repPresent: "حاضر", repLate: "متأخر", repEarly: "مبكر", repPossible: "غياب محتمل", repAbsent: "غياب معتمد",
        repIncomplete: "غير مكتمل", repLeave: "إجازة", repLateMin: "دقائق التأخير", repHours: "ساعات العمل",
        repPending: "مقترحات معلّقة", repApproved: "خصم معتمد",
        repEmpty: "اضغط «إنشاء التقرير» لعرض ملخص الشهر.", repNoData: "لا توجد سجلات لهذا الشهر.",
      }
    : {
        badge: "ATTENDANCE", badgeSub: "Attendance dashboard",
        heroTitle: "Attendance Dashboard",
        heroText: "Follow your team's attendance day by day, and review lateness and proposed deductions before they reach payroll.",
        chips: ["Single day", "Auto evaluation", "Deduction review"],
        tabDaily: "Daily", tabMonthly: "Monthly report",
        date: "Date", refresh: "Refresh", today: "Today", prevDay: "Previous day", nextDay: "Next day",
        statTotal: "Scheduled employees", statTotalNote: "Based on assignments and work days",
        statIn: "Checked in", statInNote: "Have a recorded check-in",
        statLate: "Late", statLateNote: "Recorded or running lateness",
        statMissing: "Not checked in", statMissingNote: "No check-in yet or possible absence",
        statDed: "Deductions awaiting decision", statDedNote: "Open proposals",
        search: "Search by name, employee number or department", all: "All statuses",
        colName: "Employee", colNumber: "Employee no.", colDept: "Department", colStatus: "Status",
        colIn: "Check-in", colOut: "Check-out", colLate: "Late (min)", colEarly: "Early (min)", colDeduction: "Deduction",
        runningLate: "Running lateness: not checked in yet, no deduction is created before evaluation",
        awaitingAmount: "Amount pending", confirmAbsence: "Confirm absence",
        confirmQ: "Confirm this day as an absence and create a deduction proposal for review?",
        empty: "No employees have a shift on this day.", noMatch: "No matching results.",
        loadingTitle: "Loading today's attendance", loadingText: "Evaluating the day and loading employee records.",
        errorTitle: "Unable to load attendance", retry: "Retry",
        evalWarn: "The day could not be evaluated, showing live status only: ",
        incident: { late: "Late", early_leave: "Early", absence: "Absence" } as Record<string, string>,
        month: "Month", generate: "Generate report", generating: "Generating report...",
        monthHint: "The whole month (up to today) is evaluated, then the summary is shown.",
        futureMonth: "You cannot generate a report for a future month.",
        repPresent: "Present", repLate: "Late", repEarly: "Early leave", repPossible: "Possible absence", repAbsent: "Confirmed absence",
        repIncomplete: "Incomplete", repLeave: "Leave", repLateMin: "Late minutes", repHours: "Worked hours",
        repPending: "Pending proposals", repApproved: "Approved deductions",
        repEmpty: "Press “Generate report” to see the month summary.", repNoData: "No records for this month.",
      };

  const [tab, setTab] = useState<"daily" | "monthly">("daily");

  // اليومي
  const [date, setDate] = useState(todayKey());
  const [rows, setRows] = useState<DailyRow[]>([]);
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // الشهري
  const [month, setMonth] = useState(todayKey().slice(0, 7));
  const [report, setReport] = useState<MonthlyRow[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [monthlyError, setMonthlyError] = useState("");

  const loadDaily = useCallback(async () => {
    setState("loading");
    setError("");
    setWarning("");
    try {
      // تقييم اليوم (idempotent) كي تظهر المقترحات؛ لا تقييم لتاريخ مستقبلي
      if (date <= todayKey()) {
        try {
          await post("/api/attendance/evaluate", { from: date, to: date });
        } catch (e) {
          setWarning(`${copy.evalWarn}${e instanceof Error ? ` ${localizeErrorMessage(e.message)}` : ""}`);
        }
      }
      const r = await api(`/api/attendance/daily?date=${date}`);
      setRows((r.data ?? []) as DailyRow[]);
      setState("loaded");
    } catch (e) {
      setError(e instanceof Error ? localizeErrorMessage(e.message) : localizeErrorMessage(""));
      setState("error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  useEffect(() => {
    void loadDaily();
  }, [loadDaily]);

  async function confirmAbsence(dayId: string) {
    if (!window.confirm(copy.confirmQ)) return;
    try {
      await api(`/api/attendance/days/${dayId}/confirm-absence`, { method: "POST" });
      await loadDaily();
    } catch (e) {
      setWarning(e instanceof Error ? localizeErrorMessage(e.message) : localizeErrorMessage(""));
    }
  }

  async function generateMonthly() {
    setGenerating(true);
    setMonthlyError("");
    try {
      const [y, m] = month.split("-").map(Number);
      const from = `${month}-01`;
      const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
      const monthEnd = `${month}-${String(last).padStart(2, "0")}`;
      const to = monthEnd < todayKey() ? monthEnd : todayKey();

      if (to < from) throw new Error(copy.futureMonth);

      await post("/api/attendance/evaluate", { from, to });
      const r = await api(`/api/attendance/reports?month=${month}`);
      setReport((r.data ?? []) as MonthlyRow[]);
      setGenerated(true);
    } catch (e) {
      setMonthlyError(e instanceof Error ? localizeErrorMessage(e.message) : localizeErrorMessage(""));
    } finally {
      setGenerating(false);
    }
  }

  const filteredRows = useMemo(() => {
    const q = search.trim().toLocaleLowerCase(isArabic ? "ar" : "en");
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      return [r.name, r.employeeNumber, r.department]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase(isArabic ? "ar" : "en")
        .includes(q);
    });
  }, [rows, search, statusFilter, isArabic]);

  const statCards = [
    { code: "ALL", label: copy.statTotal, value: rows.length, note: copy.statTotalNote },
    { code: "IN", label: copy.statIn, value: rows.filter((r) => r.checkIn).length, note: copy.statInNote },
    { code: "LATE", label: copy.statLate, value: rows.filter((r) => r.lateMinutes > 0).length, note: copy.statLateNote },
    {
      code: "OUT",
      label: copy.statMissing,
      value: rows.filter(
        (r) => !r.checkIn && ["not_yet", "possible_absence", "absent_confirmed"].includes(r.status),
      ).length,
      note: copy.statMissingNote,
    },
    {
      code: "DED",
      label: copy.statDed,
      value: rows.reduce((n, r) => n + r.proposals.filter((p) => OPEN_PROPOSAL.includes(p.status)).length, 0),
      note: copy.statDedNote,
    },
  ];

  const dailyHeadings = [
    copy.colName, copy.colNumber, copy.colDept, copy.colStatus,
    copy.colIn, copy.colOut, copy.colLate, copy.colEarly, copy.colDeduction,
  ];

  const monthlyHeadings = [
    copy.colName, copy.colNumber, copy.colDept, copy.repPresent, copy.repLate, copy.repEarly,
    copy.repPossible, copy.repAbsent, copy.repIncomplete, copy.repLeave, copy.repLateMin,
    copy.repHours, copy.repPending, copy.repApproved,
  ];

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

        {/* --------------------------- Tabs + date --------------------------- */}
        <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
          <div className="flex gap-2">
            {([["daily", copy.tabDaily], ["monthly", copy.tabMonthly]] as const).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setTab(k)}
                className={`rounded-xl px-5 py-2.5 text-sm font-black transition ${
                  tab === k
                    ? "bg-[var(--brand-primary)] text-white shadow-sm"
                    : "border border-[var(--border-default)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "daily" && (
            <div className="flex flex-wrap items-end gap-2">
              <button
                type="button"
                aria-label={copy.prevDay}
                onClick={() => setDate(shiftDate(date, -1))}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)]"
              >
                {isArabic ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>

              <label className="block text-xs font-black text-[var(--text-secondary)]">
                {copy.date}
                <input
                  type="date"
                  dir="ltr"
                  value={date}
                  onChange={(e) => e.target.value && setDate(e.target.value)}
                  className="mt-1 block h-11 rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)]"
                />
              </label>

              <button
                type="button"
                aria-label={copy.nextDay}
                onClick={() => setDate(shiftDate(date, 1))}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)]"
              >
                {isArabic ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>

              <button
                type="button"
                onClick={() => setDate(todayKey())}
                className="h-11 rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-4 text-sm font-black text-[var(--brand-primary)] hover:border-[var(--brand-primary)] hover:bg-[var(--brand-subtle)]"
              >
                {copy.today}
              </button>

              <button
                type="button"
                onClick={() => void loadDaily()}
                disabled={state === "loading"}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-4 text-sm font-black text-white hover:opacity-90 disabled:opacity-50"
              >
                <RefreshCw size={16} className={state === "loading" ? "animate-spin" : ""} />
                {copy.refresh}
              </button>
            </div>
          )}
        </div>

        {/* ------------------------------ Daily ------------------------------ */}
        {tab === "daily" && (
          <>
            {warning && (
              <div
                role="status"
                className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900"
              >
                {warning}
              </div>
            )}

            {state === "loading" && (
              <section className="mt-5 rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow-small)]">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-subtle)]">
                  <span className="h-5 w-5 animate-pulse rounded-full bg-[var(--brand-primary)]" />
                </div>
                <p className="mt-4 text-base font-black">{copy.loadingTitle}</p>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{copy.loadingText}</p>
              </section>
            )}

            {state === "error" && (
              <section className="mt-5 rounded-[28px] border border-amber-300 bg-amber-50 p-8 text-center text-amber-950 shadow-[var(--shadow-small)]">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-lg font-black text-amber-800">
                  !
                </div>
                <h2 className="mt-4 text-xl font-black">{copy.errorTitle}</h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-7">{error}</p>
                <button
                  type="button"
                  onClick={() => void loadDaily()}
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--text-primary)] px-6 text-sm font-black text-[var(--surface)] transition hover:opacity-90"
                >
                  {copy.retry}
                </button>
              </section>
            )}

            {state === "loaded" && (
              <>
                {/* Stats */}
                <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                  {statCards.map((card) => (
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

                {/* Table */}
                <section className="mt-5 overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
                  <div className="flex flex-col gap-3 border-b border-[var(--border-default)] bg-[var(--surface-muted)] p-4 sm:flex-row sm:items-center">
                    <input
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={copy.search}
                      className="h-11 min-w-0 flex-1 rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:bg-[var(--surface)]"
                    />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="h-11 rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm font-bold text-[var(--text-secondary)] outline-none focus:border-[var(--brand-primary)]"
                    >
                      <option value="all">{copy.all}</option>
                      {STATUS_FILTERS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px] text-start text-sm">
                      <thead className="text-[var(--text-secondary)]">
                        <tr>
                          {dailyHeadings.map((h) => (
                            <th key={h} scope="col" className="whitespace-nowrap px-4 py-3 text-start text-xs font-black">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-default)]">
                        {filteredRows.map((r) => (
                          <tr key={r.userId} className="transition hover:bg-[var(--surface-muted)]">
                            <td className="px-4 py-3.5 font-black">{r.name}</td>
                            <td className="px-4 py-3.5 font-bold text-[var(--text-secondary)]">{r.employeeNumber ?? "—"}</td>
                            <td className="px-4 py-3.5 font-bold text-[var(--text-secondary)]">{r.department ?? "—"}</td>
                            <td className="px-4 py-3.5">
                              <div className="flex flex-col items-start gap-1.5">
                                <StatusBadge status={r.status} isArabic={isArabic} />
                                {r.status === "possible_absence" && r.dayId && (
                                  <button
                                    type="button"
                                    onClick={() => void confirmAbsence(r.dayId as string)}
                                    className="rounded-lg border border-[var(--border-default)] bg-[var(--surface)] px-2.5 py-1 text-[11px] font-black text-[var(--brand-primary)] transition hover:border-[var(--brand-primary)] hover:bg-[var(--brand-subtle)]"
                                  >
                                    {copy.confirmAbsence}
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3.5">{fmtTime(r.checkIn, r.timezone, isArabic)}</td>
                            <td className="whitespace-nowrap px-4 py-3.5">{fmtTime(r.checkOut, r.timezone, isArabic)}</td>
                            <td className="px-4 py-3.5">
                              {r.lateMinutes > 0 ? (
                                <span
                                  title={r.lateIsRunning ? copy.runningLate : undefined}
                                  className={`font-black text-amber-700 ${r.lateIsRunning ? "italic opacity-80" : ""}`}
                                >
                                  {r.lateMinutes}
                                  {r.lateIsRunning ? "*" : ""}
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="px-4 py-3.5">
                              {r.earlyLeaveMinutes > 0 ? (
                                <span className="font-black text-amber-700">{r.earlyLeaveMinutes}</span>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="px-4 py-3.5">
                              {r.proposals.length === 0 ? (
                                "—"
                              ) : (
                                <div className="space-y-1.5">
                                  {r.proposals.map((p) => {
                                    const amount = p.final_amount ?? p.original_amount;
                                    return (
                                      <div key={p.id} className="flex flex-wrap items-center gap-2">
                                        <span className="text-[11px] font-bold text-[var(--text-secondary)]">
                                          {copy.incident[p.incident_type]}
                                        </span>
                                        <span className="font-black">
                                          {amount === null ? copy.awaitingAmount : fmtMoney(amount, isArabic)}
                                        </span>
                                        <StatusBadge status={p.status} isArabic={isArabic} />
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {filteredRows.length === 0 && (
                      <div className="px-4 py-14 text-center text-sm font-bold text-[var(--text-secondary)]">
                        {rows.length === 0 ? copy.empty : copy.noMatch}
                      </div>
                    )}
                  </div>

                  {rows.some((r) => r.lateIsRunning) && (
                    <p className="border-t border-[var(--border-default)] px-5 py-3 text-[11px] font-bold text-[var(--text-muted)]">
                      * {copy.runningLate}
                    </p>
                  )}
                </section>
              </>
            )}
          </>
        )}

        {/* ----------------------------- Monthly ----------------------------- */}
        {tab === "monthly" && (
          <>
            {monthlyError && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700"
              >
                {monthlyError}
              </div>
            )}

            <section className="mt-5 overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
              <div className="flex flex-col gap-3 border-b border-[var(--border-default)] bg-[var(--surface-muted)] p-4 sm:flex-row sm:items-end">
                <label className="block text-xs font-black text-[var(--text-secondary)]">
                  {copy.month}
                  <input
                    type="month"
                    dir="ltr"
                    value={month}
                    onChange={(e) => {
                      setMonth(e.target.value);
                      setGenerated(false);
                      setReport([]);
                    }}
                    disabled={generating}
                    className="mt-1 block h-11 w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)] sm:w-56"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => void generateMonthly()}
                  disabled={generating || !month}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 text-sm font-black text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {generating && <LoaderCircle size={16} className="animate-spin" />}
                  {generating ? copy.generating : copy.generate}
                </button>

                <p className="text-[11px] font-bold text-[var(--text-muted)] sm:ms-2">{copy.monthHint}</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px] text-start text-sm">
                  <thead className="text-[var(--text-secondary)]">
                    <tr>
                      {monthlyHeadings.map((h) => (
                        <th key={h} scope="col" className="whitespace-nowrap px-4 py-3 text-start text-xs font-black">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-default)]">
                    {report.map((a) => (
                      <Fragment key={a.userId}>
                        <tr className="transition hover:bg-[var(--surface-muted)]">
                          <td className="px-4 py-3.5 font-black">{a.name}</td>
                          <td className="px-4 py-3.5 font-bold text-[var(--text-secondary)]">{a.employeeNumber ?? "—"}</td>
                          <td className="px-4 py-3.5 font-bold text-[var(--text-secondary)]">{a.department ?? "—"}</td>
                          <td className="px-4 py-3.5">{a.present}</td>
                          <td className="px-4 py-3.5">{a.late}</td>
                          <td className="px-4 py-3.5">{a.earlyLeave}</td>
                          <td className="px-4 py-3.5">{a.possibleAbsence}</td>
                          <td className="px-4 py-3.5">{a.absent}</td>
                          <td className="px-4 py-3.5">{a.incomplete}</td>
                          <td className="px-4 py-3.5">{a.onLeave}</td>
                          <td className="px-4 py-3.5">{a.lateMinutes}</td>
                          <td className="whitespace-nowrap px-4 py-3.5">{fmtMinutes(a.workedMinutes, isArabic)}</td>
                          <td className="px-4 py-3.5">{a.pendingProposals}</td>
                          <td className="whitespace-nowrap px-4 py-3.5 font-black">
                            {fmtMoney(a.approvedAmount, isArabic)}
                          </td>
                        </tr>
                      </Fragment>
                    ))}
                  </tbody>
                </table>

                {report.length === 0 && (
                  <div className="px-4 py-14 text-center text-sm font-bold text-[var(--text-secondary)]">
                    {generated ? copy.repNoData : copy.repEmpty}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}