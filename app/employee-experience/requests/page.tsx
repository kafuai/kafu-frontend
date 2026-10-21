"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays, Check, CircleAlert, FileText, Inbox, Loader2,
  Paperclip, Search, UserRound, X,
} from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { api, fmtTime, StatusBadge } from "@/components/attendance/shared";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type RequestStatus = "pending" | "approved" | "rejected" | "cancelled";
type RequestGroup = "leave" | "letter" | "attendance";
type CorrectionType =
  | "missed_check_in" | "missed_check_out" | "time_change"
  | "dispute_late" | "dispute_absence" | "excuse";

const TIME_TYPES: CorrectionType[] = ["missed_check_in", "missed_check_out", "time_change"];

type LeaveBalanceInfo = {
  year: number; allowance: number; approved: number; pending: number;
  used: number; remaining: number; requested: number; remainingAfter: number;
};
type TimePair = { checkIn?: string | null; checkOut?: string | null };

type Base = {
  key: string;            // `${source}:${id}` (unique across tables)
  id: string;             // original id in its own table
  source: "employee_requests" | "attendance_corrections";
  status: RequestStatus;
  employeeId: string;
  employeeName: string;
  createdAt: number;
  reason: string;
  reviewedByName: string | null;
};
type LeaveItem = Base & {
  group: "leave";
  leaveType: string | null;
  startDate: number | null;
  endDate: number | null;
  leaveBalance: LeaveBalanceInfo | null;
  hasAttachment: boolean;
  attachmentName: string | null;
};
type LetterItem = Base & { group: "letter" };
type CorrectionItem = Base & {
  group: "attendance";
  correctionType: CorrectionType;
  workDate: string;
  original: TimePair | null;
  proposed: TimePair | null;
  decisionNote: string | null;
};
type UnifiedRequest = LeaveItem | LetterItem | CorrectionItem;

type RawEmployeeRequest = {
  id: string; employeeId: string; employeeName?: string;
  requestType: "leave" | "employment_letter";
  status: RequestStatus; reason: string;
  startDate?: number; endDate?: number; createdAt: number;
  leaveType?: string; reviewedByName?: string | null;
  leaveBalance?: LeaveBalanceInfo | null;
  hasAttachment?: boolean; attachmentName?: string | null;
};
type RawCorrection = {
  id: string; user_id: string; userName?: string; status: RequestStatus;
  created_at: string; reason: string; correction_type: CorrectionType;
  work_date: string; original_value?: TimePair | null; proposed_value?: TimePair | null;
  reviewedByName?: string | null; decision_note?: string | null;
};

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

function mapEmployeeRequest(r: RawEmployeeRequest): LeaveItem | LetterItem {
  const base = {
    id: r.id,
    key: `employee_requests:${r.id}`,
    source: "employee_requests" as const,
    status: r.status,
    employeeId: r.employeeId,
    employeeName: r.employeeName ?? r.employeeId,
    createdAt: r.createdAt,
    reason: r.reason ?? "",
    reviewedByName: r.reviewedByName ?? null,
  };
  if (r.requestType === "leave") {
    return {
      ...base,
      group: "leave",
      leaveType: r.leaveType ?? null,
      startDate: r.startDate ?? null,
      endDate: r.endDate ?? null,
      leaveBalance: r.leaveBalance ?? null,
      hasAttachment: Boolean(r.hasAttachment),
      attachmentName: r.attachmentName ?? null,
    };
  }
  return { ...base, group: "letter" };
}

function mapCorrection(r: RawCorrection): CorrectionItem {
  return {
    id: r.id,
    key: `attendance_corrections:${r.id}`,
    source: "attendance_corrections",
    group: "attendance",
    status: r.status,
    employeeId: r.user_id,
    employeeName: r.userName ?? r.user_id,
    createdAt: Date.parse(r.created_at),
    reason: r.reason ?? "",
    reviewedByName: r.reviewedByName ?? null,
    correctionType: r.correction_type,
    workDate: r.work_date,
    original: r.original_value ?? null,
    proposed: r.proposed_value ?? null,
    decisionNote: r.decision_note ?? null,
  };
}

function shortRef(r: UnifiedRequest): string {
  const s = r.id.replace(/-/g, "").slice(-6).toUpperCase();
  return `${r.source === "attendance_corrections" ? "ATT" : "REQ"}-${s}`;
}

// Riyadh is UTC+3 with no DST.
const dayStart = (k: string) => Date.parse(`${k}T00:00:00+03:00`);
const dayEnd = (k: string) => Date.parse(`${k}T23:59:59.999+03:00`);

const fieldCls =
  "h-11 w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)]";
const boxCls = "rounded-2xl border border-[var(--border-default)] bg-[var(--background)] p-4";

/* -------------------------------------------------------------------------- */
/*                                    Page                                    */
/* -------------------------------------------------------------------------- */

export default function EmployeeExperienceRequestsPage() {
  const { locale } = useLocalization();
  const ar = locale === "ar";

  const copy = useMemo(() => ({
    eyebrow: ar ? "تجربة الموظف" : "EMPLOYEE EXPERIENCE",
    title: ar ? "الطلبات" : "Requests",
    description: ar
      ? "جميع طلبات الموظفين في مكان واحد: الإجازات وخطابات التعريف وتصحيح الحضور والاعتراضات والأعذار."
      : "All employee requests in one place: leave, employment letters, attendance corrections, disputes and excuses.",
    statTotal: ar ? "إجمالي الطلبات" : "Total requests",
    statPending: ar ? "معلّقة" : "Pending",
    statApproved: ar ? "مقبولة" : "Approved",
    statRejected: ar ? "مرفوضة" : "Rejected",
    cancelled: ar ? "ملغي" : "Cancelled",
    listTitle: ar ? "الطلبات" : "Requests",
    search: ar ? "ابحث باسم الموظف..." : "Search by employee name...",
    allTypes: ar ? "كل الأنواع" : "All types",
    allStatuses: ar ? "كل الحالات" : "All statuses",
    from: ar ? "من تاريخ" : "From",
    to: ar ? "إلى تاريخ" : "To",
    clear: ar ? "مسح الفلاتر" : "Clear filters",
    empty: ar ? "لا توجد طلبات." : "No requests.",
    noMatch: ar ? "لا توجد نتائج مطابقة." : "No matching results.",
    pick: ar ? "اختر طلبًا لعرض تفاصيله." : "Select a request to see its details.",
    loading: ar ? "جارٍ تحميل الطلبات..." : "Loading requests...",
    errorTitle: ar ? "تعذر تحميل الطلبات" : "Couldn't load requests",
    retry: ar ? "إعادة المحاولة" : "Retry",
    loadFailed: ar ? "تعذر تحميل الطلبات." : "Unable to load requests.",
    partialFailed: ar
      ? "تعذر تحميل جزء من الطلبات، والقائمة المعروضة قد تكون ناقصة."
      : "Part of the requests could not be loaded; the list may be incomplete.",
    decisionSaved: ar ? "تم حفظ القرار." : "Decision saved.",
    evalFailed: ar
      ? "تم اعتماد التصحيح لكن تعذر إعادة تقييم اليوم تلقائيًا. افتح لوحة الحضور واضغط تحديث."
      : "The correction was approved but the day could not be re-evaluated automatically. Open the attendance dashboard and press refresh.",
    attachment: ar ? "المرفق" : "Attachment",
    openAttachment: ar ? "فتح المرفق" : "Open attachment",
    attachmentError: ar ? "تعذر فتح المرفق." : "Unable to open the attachment.",
    employee: ar ? "الموظف" : "Employee",
    created: ar ? "تاريخ الإنشاء" : "Created",
    reason: ar ? "سبب الطلب" : "Request reason",
    leaveType: ar ? "نوع الإجازة" : "Leave type",
    period: ar ? "الفترة المطلوبة" : "Requested period",
    workDate: ar ? "تاريخ الدوام" : "Shift date",
    orig: ar ? "الأصلي" : "Original",
    prop: ar ? "المقترح" : "Proposed",
    in: ar ? "حضور" : "In",
    out: ar ? "انصراف" : "Out",
    noTimes: ar
      ? "هذا النوع لا يحمل أوقاتًا مقترحة. الموافقة عليه تُغلق المقترحات المالية المفتوحة المرتبطة، دون إنشاء أحداث حضور."
      : "This type carries no proposed times. Approving it closes the related open financial proposals, without creating attendance events.",
    approveHint: ar
      ? "الموافقة على تصحيح وقت تضيف حدثًا جديدًا بمصدر «تصحيح»، وتعيد تقييم اليوم."
      : "Approving a time correction adds a new event with source “correction” and re-evaluates the day.",
    note: ar ? "ملاحظة القرار (اختياري)" : "Decision note (optional)",
    approve: ar ? "موافقة" : "Approve",
    reject: ar ? "رفض" : "Reject",
    decidedBy: ar ? "قرار بواسطة" : "Decided by",
    balance: ar ? "رصيد الموظف" : "Employee balance",
    balAllowance: ar ? "المسموح" : "Allowance",
    balUsed: ar ? "المستخدم" : "Used",
    balPending: ar ? "معلّق (أخرى)" : "Other pending",
    balRequested: ar ? "المطلوب الآن" : "Requested now",
    balAfter: ar ? "المتبقي بعد الموافقة" : "Remaining if approved",
    groups: {
      leave: ar ? "إجازة" : "Leave",
      letter: ar ? "خطاب تعريف" : "Employment letter",
      attendance: ar ? "حضور" : "Attendance",
    } as Record<string, string>,
    types: {
      leave: ar ? "طلب إجازة" : "Leave request",
      letter: ar ? "طلب خطاب تعريف" : "Employment letter request",
      missed_check_in: ar ? "نسيان تسجيل الحضور" : "Missed check-in",
      missed_check_out: ar ? "نسيان تسجيل الانصراف" : "Missed check-out",
      time_change: ar ? "تعديل وقت" : "Time change",
      dispute_late: ar ? "اعتراض على التأخير" : "Lateness dispute",
      dispute_absence: ar ? "اعتراض على الغياب" : "Absence dispute",
      excuse: ar ? "تسجيل عذر" : "Excuse",
    } as Record<string, string>,
    leaveTypes: {
      annual: ar ? "إجازة سنوية" : "Annual leave",
      sick: ar ? "إجازة مرضية" : "Sick leave",
      emergency: ar ? "إجازة طارئة" : "Emergency leave",
      unpaid: ar ? "إجازة بدون راتب" : "Unpaid leave",
      maternity: ar ? "إجازة أمومة" : "Maternity leave",
      other: ar ? "إجازة أخرى" : "Other leave",
    } as Record<string, string>,
  }), [ar]);

  /* ------------------------------- state ------------------------------- */

  const [items, setItems] = useState<UnifiedRequest[]>([]);
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [banner, setBanner] = useState<{ kind: "ok" | "error" | "warn"; text: string } | null>(null);
  const [busyKey, setBusyKey] = useState("");
  const [attachmentError, setAttachmentError] = useState("");

  const [group, setGroup] = useState<RequestGroup | "all">("all");
  const [status, setStatus] = useState<RequestStatus | "all">("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [search, setSearch] = useState("");
  const [selectedKey, setSelectedKey] = useState("");
  const [note, setNote] = useState("");

  /* ------------------------------- loading ------------------------------ */

  const load = useCallback(async () => {
    const [emp, att] = await Promise.allSettled([
      api<{ data?: RawEmployeeRequest[] }>("/api/employee-experience"),
      api<{ canManage?: boolean; data?: RawCorrection[] }>("/api/attendance/corrections"),
    ]);

    const next: UnifiedRequest[] = [];
    let failures = 0;

    if (emp.status === "fulfilled") {
      next.push(...(emp.value.data ?? []).map(mapEmployeeRequest));
    } else failures += 1;

    // The corrections endpoint also serves normal employees (their own rows).
    // Include it only for real reviewers (canManage). 403/Unauthorized = no
    // attendance access, which is not a failure.
    if (att.status === "fulfilled") {
      if (att.value.canManage) next.push(...(att.value.data ?? []).map(mapCorrection));
    } else if (!/forbidden|unauthorized/i.test(String(att.reason?.message ?? ""))) {
      failures += 1;
    }

    if (failures === 2 || (failures === 1 && next.length === 0)) {
      const reason = emp.status === "rejected" ? emp.reason : att.status === "rejected" ? att.reason : null;
      setError(reason instanceof Error ? reason.message : copy.loadFailed);
      setState("error");
      return;
    }

    setWarning(failures > 0 ? copy.partialFailed : "");
    next.sort((a, b) => b.createdAt - a.createdAt);
    setItems(next);
    setState("loaded");
  }, [copy.loadFailed, copy.partialFailed]);

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => setNote(""), [selectedKey]);

  /* ------------------------------ decisions ----------------------------- */

  async function decide(item: UnifiedRequest, action: "approve" | "reject") {
    setBusyKey(item.key);
    setBanner(null);
    try {
      if (item.group === "attendance") {
        await api(`/api/attendance/corrections/${item.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, note }),
        });

        // Same behaviour as the old corrections page: re-evaluate the day.
        let evalFailed = false;
        if (action === "approve") {
          try {
            await api("/api/attendance/evaluate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ from: item.workDate, to: item.workDate }),
            });
          } catch {
            evalFailed = true;
          }
        }
        setBanner(
          evalFailed
            ? { kind: "warn", text: copy.evalFailed }
            : { kind: "ok", text: copy.decisionSaved },
        );
      } else {
        const base =
          item.group === "letter"
            ? "/api/employee-experience/letters"
            : "/api/employee-experience/requests";
        await api(`${base}/${item.id}/${action}`, { method: "POST" });
        setBanner({ kind: "ok", text: copy.decisionSaved });
      }
      await load();
    } catch (e) {
      setBanner({ kind: "error", text: e instanceof Error ? e.message : "Error" });
    } finally {
      setBusyKey("");
    }
  }

  async function openAttachment(requestId: string) {
    setAttachmentError("");
    try {
      const res = await fetch(`/api/employee-experience/requests/${requestId}/attachment`);
      const payload = await res.json();
      if (!res.ok || !payload.data?.url) {
        throw new Error(payload.error ?? copy.attachmentError);
      }
      const a = document.createElement("a");
      a.href = payload.data.url;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      setAttachmentError(e instanceof Error ? e.message : copy.attachmentError);
    }
  }

  /* ------------------------------- derived ------------------------------ */

  const stats = useMemo(() => ({
    total: items.length,
    pending: items.filter((r) => r.status === "pending").length,
    approved: items.filter((r) => r.status === "approved").length,
    rejected: items.filter((r) => r.status === "rejected").length,
  }), [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase(ar ? "ar" : "en");
    return items.filter((r) => {
      if (group !== "all" && r.group !== group) return false;
      if (status !== "all" && r.status !== status) return false;
      if (from && r.createdAt < dayStart(from)) return false;
      if (to && r.createdAt > dayEnd(to)) return false;
      if (q && !r.employeeName.toLocaleLowerCase(ar ? "ar" : "en").includes(q)) return false;
      return true;
    });
  }, [items, group, status, from, to, search, ar]);

  const selected: UnifiedRequest | null =
    filtered.find((r) => r.key === selectedKey) ?? filtered[0] ?? null;

  const typeLabel = (r: UnifiedRequest) =>
    r.group === "attendance" ? copy.types[r.correctionType] ?? r.correctionType : copy.types[r.group];

  const fmtDate = (n: number) =>
    new Intl.DateTimeFormat(ar ? "ar-SA" : "en-US", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(n));
  const fmtShort = (n: number) =>
    new Intl.DateTimeFormat(ar ? "ar-SA" : "en-US", { day: "2-digit", month: "short" }).format(new Date(n));

  const hasFilters = group !== "all" || status !== "all" || from || to || search;
  const clearFilters = () => { setGroup("all"); setStatus("all"); setFrom(""); setTo(""); setSearch(""); };

  const pair = (v: TimePair | null) =>
    v && (v.checkIn || v.checkOut) ? (
      <span className="flex flex-col gap-1">
        <span>{copy.in}: <b dir="ltr">{fmtTime(v.checkIn, undefined, ar)}</b></span>
        <span>{copy.out}: <b dir="ltr">{fmtTime(v.checkOut, undefined, ar)}</b></span>
      </span>
    ) : "—";

  const statCards = [
    { label: copy.statTotal, value: stats.total },
    { label: copy.statPending, value: stats.pending },
    { label: copy.statApproved, value: stats.approved },
    { label: copy.statRejected, value: stats.rejected },
  ];

  /* -------------------------------- render ------------------------------ */

  return (
    <main dir={ar ? "rtl" : "ltr"} className="min-h-[calc(100vh-76px)] bg-[var(--background)]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <header className="mb-6">
          <span className="text-[11px] font-bold tracking-[0.14em] text-[var(--text-muted)]">{copy.eyebrow}</span>
          <h1 className="mt-2 text-2xl font-black tracking-[-0.03em] sm:text-3xl">{copy.title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">{copy.description}</p>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statCards.map((c) => (
            <article key={c.label} className="rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] p-4 shadow-[var(--shadow-small)]">
              <p className="text-2xl font-black tracking-tight">{c.value}</p>
              <p className="mt-0.5 text-xs font-bold text-[var(--text-muted)]">{c.label}</p>
            </article>
          ))}
        </section>

        {banner && (
          <div
            role={banner.kind === "error" ? "alert" : "status"}
            className={`mt-4 rounded-xl border px-4 py-3 text-sm font-bold ${
              banner.kind === "ok" ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : banner.kind === "warn" ? "border-amber-300 bg-amber-50 text-amber-900"
              : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {banner.text}
          </div>
        )}
        {warning && state === "loaded" && (
          <div role="status" className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">{warning}</div>
        )}

        <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.38fr)]">
          {/* ------------------------------ List ------------------------------ */}
          <article className="min-w-0 overflow-hidden rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
            <div className="space-y-3 border-b border-[var(--border-default)] p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black">{copy.listTitle}</h2>
                <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-[var(--surface-muted)] px-2 text-xs font-black">{filtered.length}</span>
              </div>
              <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={copy.search} className={fieldCls} />
              <div className="grid grid-cols-2 gap-2">
                <select value={group} onChange={(e) => setGroup(e.target.value as RequestGroup | "all")} className={fieldCls}>
                  <option value="all">{copy.allTypes}</option>
                  <option value="leave">{copy.groups.leave}</option>
                  <option value="letter">{copy.groups.letter}</option>
                  <option value="attendance">{copy.groups.attendance}</option>
                </select>
                <select value={status} onChange={(e) => setStatus(e.target.value as RequestStatus | "all")} className={fieldCls}>
                  <option value="all">{copy.allStatuses}</option>
                  <option value="pending">{copy.statPending}</option>
                  <option value="approved">{copy.statApproved}</option>
                  <option value="rejected">{copy.statRejected}</option>
                  <option value="cancelled">{copy.cancelled}</option>
                </select>
                <label className="text-[11px] font-black text-[var(--text-secondary)]">{copy.from}
                  <input type="date" dir="ltr" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} className={`${fieldCls} mt-1`} />
                </label>
                <label className="text-[11px] font-black text-[var(--text-secondary)]">{copy.to}
                  <input type="date" dir="ltr" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} className={`${fieldCls} mt-1`} />
                </label>
              </div>
              {hasFilters && (
                <button type="button" onClick={clearFilters} className="text-xs font-black text-[var(--brand-primary)]">{copy.clear}</button>
              )}
            </div>

            <div className="max-h-[720px] overflow-y-auto p-3">
              {state === "loading" ? (
                <div className="flex min-h-56 flex-col items-center justify-center gap-3 text-center">
                  <Loader2 size={22} className="animate-spin text-[var(--brand-primary)]" />
                  <p className="text-sm font-bold text-[var(--text-muted)]">{copy.loading}</p>
                </div>
              ) : state === "error" ? (
                <div className="flex min-h-56 flex-col items-center justify-center gap-3 px-6 text-center">
                  <CircleAlert size={22} className="text-[var(--critical)]" />
                  <p className="text-sm font-bold">{copy.errorTitle}</p>
                  <p className="text-xs text-[var(--text-muted)]">{error}</p>
                  <button
                    type="button"
                    onClick={() => { setState("loading"); void load(); }}
                    className="rounded-lg border border-[var(--border-default)] px-3 py-1.5 text-xs font-bold hover:bg-[var(--surface-muted)]"
                  >
                    {copy.retry}
                  </button>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex min-h-56 flex-col items-center justify-center text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--text-muted)]">
                    {items.length === 0 ? <Inbox size={20} /> : <Search size={20} />}
                  </span>
                  <p className="mt-4 text-sm font-bold">{items.length === 0 ? copy.empty : copy.noMatch}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map((r) => {
                    const active = selected?.key === r.key;
                    return (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => setSelectedKey(r.key)}
                        className={`block w-full rounded-2xl border p-4 text-start transition ${
                          active ? "border-blue-200 bg-[var(--brand-subtle)]" : "border-transparent hover:border-[var(--border-default)] hover:bg-[var(--background)]"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${active ? "bg-[var(--brand-primary)] text-white" : "bg-[var(--surface-muted)] text-[var(--text-secondary)]"}`}>
                            {r.group === "leave" ? <CalendarDays size={16} /> : r.group === "letter" ? <FileText size={16} /> : <UserRound size={16} />}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-black">{r.employeeName}</p>
                            <p className="mt-0.5 truncate text-[11px] text-[var(--text-muted)]">{shortRef(r)} · {fmtShort(r.createdAt)}</p>
                            <p className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold">
                              <span className="rounded-md bg-[var(--brand-subtle)] px-2 py-1 text-[10px] font-extrabold text-[var(--brand-primary)]">{copy.groups[r.group]}</span>
                              <span className="truncate">{typeLabel(r)}</span>
                              {r.group === "leave" && r.hasAttachment && <Paperclip size={12} className="text-[var(--text-muted)]" />}
                            </p>
                            <div className="mt-2"><StatusBadge status={r.status} isArabic={ar} /></div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </article>

          {/* ----------------------------- Details ---------------------------- */}
          {selected ? (
            <article className="flex min-w-0 flex-col overflow-hidden rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
              <div className="border-b border-[var(--border-default)] px-5 py-5 sm:px-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-extrabold text-[var(--brand-primary)]" title={selected.id}>{shortRef(selected)}</span>
                  <span className="rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-[10px] font-extrabold text-[var(--text-secondary)]">{copy.groups[selected.group]}</span>
                  <StatusBadge status={selected.status} isArabic={ar} />
                </div>
                <h2 className="mt-2 text-xl font-black tracking-tight">{typeLabel(selected)}</h2>
                <p className="mt-1 text-xs text-[var(--text-muted)]">{copy.created}: {fmtDate(selected.createdAt)}</p>
              </div>

              <div className="space-y-4 p-5 sm:p-6">
                <div className={`${boxCls} flex items-center gap-3`}>
                  <UserRound size={17} className="text-[var(--brand-primary)]" />
                  <div>
                    <p className="text-[10px] font-bold text-[var(--text-muted)]">{copy.employee}</p>
                    <p className="font-extrabold">{selected.employeeName}</p>
                  </div>
                </div>

                {/* Leave-specific */}
                {selected.group === "leave" && (
                  <>
                    {selected.leaveType && (
                      <div className={boxCls}>
                        <p className="text-[11px] font-bold text-[var(--text-muted)]">{copy.leaveType}</p>
                        <p className="font-bold">{copy.leaveTypes[selected.leaveType] ?? selected.leaveType}</p>
                      </div>
                    )}
                    {selected.startDate && selected.endDate && (
                      <div className={`${boxCls} flex items-start gap-3`}>
                        <CalendarDays size={17} className="mt-0.5 text-[var(--brand-primary)]" />
                        <div>
                          <p className="text-[11px] font-bold text-[var(--text-muted)]">{copy.period}</p>
                          <p className="mt-0.5 text-sm font-extrabold">{fmtDate(selected.startDate)} — {fmtDate(selected.endDate)}</p>
                        </div>
                      </div>
                    )}
                    {selected.hasAttachment && (
                      <div className={boxCls}>
                        <p className="text-[11px] font-bold text-[var(--text-muted)]">{copy.attachment}</p>
                        <button
                          type="button"
                          onClick={() => void openAttachment(selected.id)}
                          className="mt-2 inline-flex items-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--surface)] px-3 py-2 text-xs font-extrabold text-[var(--brand-primary)] hover:bg-[var(--brand-subtle)]"
                        >
                          <Paperclip size={14} /> {selected.attachmentName ?? copy.openAttachment}
                        </button>
                        {attachmentError && <p className="mt-2 text-xs font-bold text-[var(--critical)]">{attachmentError}</p>}
                      </div>
                    )}
                    {selected.status === "pending" && selected.leaveBalance && (
                      <div className={boxCls}>
                        <p className="text-[11px] font-bold text-[var(--text-muted)]">{copy.balance}</p>
                        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
                          {[
                            { l: copy.balAllowance, v: selected.leaveBalance.allowance },
                            { l: copy.balUsed, v: selected.leaveBalance.approved },
                            { l: copy.balPending, v: selected.leaveBalance.pending },
                            { l: copy.balRequested, v: selected.leaveBalance.requested },
                            { l: copy.balAfter, v: selected.leaveBalance.remainingAfter },
                          ].map((s, i) => (
                            <div key={s.l} className="rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-2 py-2.5 text-center">
                              <p className={`text-base font-black ${i === 4 && s.v < 0 ? "text-[var(--critical)]" : ""}`}>{s.v}</p>
                              <p className="mt-0.5 text-[10px] font-bold text-[var(--text-muted)]">{s.l}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Attendance-correction-specific */}
                {selected.group === "attendance" && (
                  <>
                    <div className={boxCls}>
                      <p className="text-[11px] font-bold text-[var(--text-muted)]">{copy.workDate}</p>
                      <p dir="ltr" className="mt-1 font-black">{selected.workDate}</p>
                    </div>
                    {TIME_TYPES.includes(selected.correctionType) ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className={boxCls}>
                          <span className="mb-2 block text-xs font-black text-[var(--text-muted)]">{copy.orig}</span>
                          <div className="font-bold">{pair(selected.original)}</div>
                        </div>
                        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                          <span className="mb-2 block text-xs font-black text-blue-700">{copy.prop}</span>
                          <div className="font-bold text-blue-900">{pair(selected.proposed)}</div>
                        </div>
                      </div>
                    ) : (
                      <p className={`${boxCls} text-xs font-bold leading-6 text-[var(--text-secondary)]`}>{copy.noTimes}</p>
                    )}
                  </>
                )}

                {/* Reason */}
                <div className={boxCls}>
                  <p className="mb-2 flex items-center gap-2 text-[11px] font-bold text-[var(--text-muted)]">
                    <FileText size={13} /> {copy.reason}
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--text-secondary)]">{selected.reason}</p>
                </div>

                {/* Decision info */}
                {selected.status !== "pending" && selected.reviewedByName && (
                  <div className={boxCls}>
                    <p className="text-xs font-bold text-[var(--text-secondary)]">
                      {copy.decidedBy}: <b className="text-[var(--text-primary)]">{selected.reviewedByName}</b>
                      {selected.group === "attendance" && selected.decisionNote ? ` — ${selected.decisionNote}` : ""}
                    </p>
                  </div>
                )}

                {/* Actions */}
                {selected.status === "pending" && (
                  <div className="space-y-3 border-t border-[var(--border-default)] pt-5">
                    {selected.group === "attendance" && TIME_TYPES.includes(selected.correctionType) && (
                      <p className="text-[11px] font-bold text-[var(--text-muted)]">{copy.approveHint}</p>
                    )}
                    {selected.group === "attendance" && (
                      <input
                        value={note}
                        maxLength={500}
                        placeholder={copy.note}
                        onChange={(e) => setNote(e.target.value)}
                        className={fieldCls}
                      />
                    )}
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        disabled={busyKey === selected.key}
                        onClick={() => void decide(selected, "approve")}
                        className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-4 text-sm font-extrabold text-white transition hover:bg-[var(--brand-hover)] disabled:opacity-50"
                      >
                        <Check size={17} strokeWidth={2.4} /> {copy.approve}
                      </button>
                      <button
                        type="button"
                        disabled={busyKey === selected.key}
                        onClick={() => void decide(selected, "reject")}
                        className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-[var(--surface)] px-4 text-sm font-extrabold text-[var(--critical)] transition hover:bg-[var(--critical-background)] disabled:opacity-50"
                      >
                        <X size={17} strokeWidth={2.4} /> {copy.reject}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ) : (
            <article className="flex min-h-[420px] items-center justify-center rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-small)]">
              <p className="text-sm font-bold text-[var(--text-secondary)]">{copy.pick}</p>
            </article>
          )}
        </section>
      </div>
    </main>
  );
}