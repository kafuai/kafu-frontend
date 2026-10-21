"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarClock, Check, FileText, UserRound, X } from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { api, fmtDay, fmtTime, StatusBadge } from "@/components/attendance/shared";

/* ------------------------------ constants ------------------------------ */

const STATUS_FILTERS = ["pending", "approved", "rejected", "cancelled"] as const;
const TIME_TYPES = ["missed_check_in", "missed_check_out", "time_change"];

const inputCls =
  "block h-11 w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm font-bold text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:bg-[var(--surface)]";

/* -------------------------------- page -------------------------------- */

export default function AttendanceCorrectionsPage() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";

  const copy = isArabic
    ? {
        badge: "ATTENDANCE", badgeSub: "طلبات التصحيح",
        heroTitle: "طلبات تصحيح الحضور",
        heroText: "راجع طلبات الموظفين لتصحيح الحضور والانصراف أو الاعتراض على التأخير والغياب. السجل الأصلي لا يُعدَّل أبدًا، والتصحيح المعتمد يُضاف كحدث مستقل.",
        chips: ["السجل الأصلي محفوظ", "قرار موثّق", "لا اعتماد ذاتي"],
        statPending: "بانتظار المراجعة", statPendingNote: "طلبات تحتاج إلى قرارك",
        statApproved: "معتمدة", statApprovedNote: "تصحيحات تم قبولها",
        statRejected: "مرفوضة", statRejectedNote: "طلبات تم رفضها",
        statAll: "إجمالي الطلبات", statAllNote: "آخر 300 طلب",
        listTitle: "الطلبات", search: "ابحث باسم الموظف", all: "كل الحالات",
        statuses: { pending: "قيد المراجعة", approved: "معتمد", rejected: "مرفوض", cancelled: "ملغي" } as Record<string, string>,
        none: "لا توجد طلبات.", noMatch: "لا نتائج مطابقة.",
        pick: "اختر طلبًا من القائمة لعرض تفاصيله.",
        loadingTitle: "جارٍ تحميل الطلبات", loadingText: "يتم جلب طلبات التصحيح.",
        errorTitle: "تعذر تحميل الطلبات", retry: "إعادة المحاولة",
        approve: "موافقة", reject: "رفض", note: "ملاحظة القرار (اختياري)", orig: "الأصلي", prop: "المقترح",
        reason: "سبب الطلب", by: "قرار بواسطة", in: "حضور", out: "انصراف", done: "تم تنفيذ القرار.",
        evalFail: "تم اعتماد التصحيح لكن تعذر إعادة تقييم اليوم تلقائيًا. افتح لوحة الحضور واضغط تحديث.",
        shiftDate: "تاريخ الدوام", requestType: "نوع الطلب", decision: "القرار",
        noTimes: "هذا النوع لا يحمل أوقاتًا مقترحة. الموافقة عليه تُغلق المقترحات المالية المفتوحة المرتبطة، دون إنشاء أحداث حضور.",
        approveHint: "الموافقة على تصحيح وقت تضيف حدثًا جديدًا بمصدر «تصحيح»، وتعيد تقييم اليوم.",
        types: {
          missed_check_in: "نسيان تسجيل الحضور", missed_check_out: "نسيان تسجيل الانصراف", time_change: "تعديل وقت",
          dispute_late: "اعتراض على التأخير", dispute_absence: "اعتراض على الغياب", excuse: "تسجيل عذر",
        } as Record<string, string>,
      }
    : {
        badge: "ATTENDANCE", badgeSub: "Correction requests",
        heroTitle: "Attendance Correction Requests",
        heroText: "Review employee requests to correct check-ins and check-outs or to dispute lateness and absence. The original record is never edited; an approved correction is added as a separate event.",
        chips: ["Original record kept", "Documented decision", "No self-approval"],
        statPending: "Awaiting review", statPendingNote: "Requests that need your decision",
        statApproved: "Approved", statApprovedNote: "Corrections accepted",
        statRejected: "Rejected", statRejectedNote: "Requests declined",
        statAll: "Total requests", statAllNote: "Latest 300 requests",
        listTitle: "Requests", search: "Search by employee name", all: "All statuses",
        statuses: { pending: "Pending", approved: "Approved", rejected: "Rejected", cancelled: "Cancelled" } as Record<string, string>,
        none: "No requests.", noMatch: "No matching results.",
        pick: "Select a request from the list to see its details.",
        loadingTitle: "Loading requests", loadingText: "Fetching correction requests.",
        errorTitle: "Unable to load requests", retry: "Retry",
        approve: "Approve", reject: "Reject", note: "Decision note (optional)", orig: "Original", prop: "Proposed",
        reason: "Request reason", by: "Decided by", in: "In", out: "Out", done: "Decision saved.",
        evalFail: "The correction was approved but the day could not be re-evaluated automatically. Open the attendance dashboard and press refresh.",
        shiftDate: "Shift date", requestType: "Request type", decision: "Decision",
        noTimes: "This type carries no proposed times. Approving it closes the related open financial proposals, without creating attendance events.",
        approveHint: "Approving a time correction adds a new event with source “correction” and re-evaluates the day.",
        types: {
          missed_check_in: "Missed check-in", missed_check_out: "Missed check-out", time_change: "Time change",
          dispute_late: "Lateness dispute", dispute_absence: "Absence dispute", excuse: "Excuse",
        } as Record<string, string>,
      };

  const [rows, setRows] = useState<any[]>([]);
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState<{ kind: "ok" | "error" | "warn"; text: string } | null>(null);

  const [status, setStatus] = useState<string>("pending");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await api("/api/attendance/corrections");
      setRows(res.data ?? []);
      setState("loaded");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setState("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase(isArabic ? "ar" : "en");
    return rows.filter((r) => {
      if (status && r.status !== status) return false;
      if (!q) return true;
      return String(r.userName ?? "").toLocaleLowerCase(isArabic ? "ar" : "en").includes(q);
    });
  }, [rows, status, search, isArabic]);

  // نُبقي الطلب المحدد إن كان ما زال ظاهرًا، وإلا ننتقل لأول طلب
  useEffect(() => {
    if (filtered.length === 0) {
      if (selectedId) setSelectedId("");
      return;
    }
    if (!filtered.some((r) => r.id === selectedId)) setSelectedId(filtered[0].id);
  }, [filtered, selectedId]);

  const selected = filtered.find((r) => r.id === selectedId) ?? null;

  const stats = useMemo(
    () => [
      { code: "PND", label: copy.statPending, value: rows.filter((r) => r.status === "pending").length, note: copy.statPendingNote },
      { code: "APR", label: copy.statApproved, value: rows.filter((r) => r.status === "approved").length, note: copy.statApprovedNote },
      { code: "REJ", label: copy.statRejected, value: rows.filter((r) => r.status === "rejected").length, note: copy.statRejectedNote },
      { code: "ALL", label: copy.statAll, value: rows.length, note: copy.statAllNote },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows, isArabic],
  );

  async function decide(c: any, action: "approve" | "reject") {
    setBusyId(c.id);
    setMsg(null);
    try {
      await api(`/api/attendance/corrections/${c.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note: notes[c.id] ?? "" }),
      });

      let evalFailed = false;
      if (action === "approve") {
        try {
          await api("/api/attendance/evaluate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ from: c.work_date, to: c.work_date }),
          });
        } catch {
          evalFailed = true;
        }
      }

      setMsg(evalFailed ? { kind: "warn", text: copy.evalFail } : { kind: "ok", text: copy.done });
      await load();
    } catch (e) {
      setMsg({ kind: "error", text: e instanceof Error ? e.message : "Error" });
    } finally {
      setBusyId("");
    }
  }

  const pair = (v: any) =>
    v && (v.checkIn || v.checkOut) ? (
      <span className="flex flex-col gap-1">
        <span>{copy.in}: <b dir="ltr">{fmtTime(v.checkIn, undefined, isArabic)}</b></span>
        <span>{copy.out}: <b dir="ltr">{fmtTime(v.checkOut, undefined, isArabic)}</b></span>
      </span>
    ) : (
      "—"
    );

  const bannerCls = (kind: "ok" | "error" | "warn") =>
    kind === "ok"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : kind === "warn"
        ? "border-amber-300 bg-amber-50 text-amber-900"
        : "border-rose-200 bg-rose-50 text-rose-700";

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
                <span key={chip} className="rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs font-bold text-[var(--text-secondary)]">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </section>

        {msg && (
          <div role={msg.kind === "error" ? "alert" : "status"} className={`mt-4 rounded-xl border px-4 py-3 text-sm font-bold ${bannerCls(msg.kind)}`}>
            {msg.text}
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
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-lg font-black text-amber-800">!</div>
            <h2 className="mt-4 text-xl font-black">{copy.errorTitle}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7">{error}</p>
            <button
              type="button"
              onClick={() => { setState("loading"); void load(); }}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--text-primary)] px-6 text-sm font-black text-[var(--surface)] transition hover:opacity-90"
            >
              {copy.retry}
            </button>
          </section>
        )}

        {state === "loaded" && (
          <>
            {/* ------------------------------ Stats ------------------------------ */}
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

            {/* -------------------------- List + Details -------------------------- */}
            <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.38fr)]">
              {/* List */}
              <div className="flex h-[720px] flex-col overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
                <div className="space-y-3 border-b border-[var(--border-default)] bg-[var(--surface-muted)] p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-black">{copy.listTitle}</h2>
                    <span className="rounded-full bg-[var(--brand-subtle)] px-2.5 py-1 text-[11px] font-black text-[var(--brand-primary)]">
                      {filtered.length}
                    </span>
                  </div>
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={copy.search}
                    className={inputCls}
                  />
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
                    <option value="">{copy.all}</option>
                    {STATUS_FILTERS.map((s) => (
                      <option key={s} value={s}>{copy.statuses[s]}</option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto p-3">
                  {filtered.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedId(c.id)}
                      className={`flex w-full flex-col items-start gap-2 rounded-2xl border p-4 text-start transition ${
                        selectedId === c.id
                          ? "border-[var(--brand-primary)] bg-[var(--brand-subtle)]"
                          : "border-[var(--border-default)] bg-[var(--surface)] hover:border-[var(--brand-primary)]"
                      }`}
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className="flex min-w-0 items-center gap-2 font-black">
                          <UserRound size={15} className="shrink-0 text-[var(--brand-primary)]" />
                          <span className="truncate">{c.userName}</span>
                        </span>
                        <StatusBadge status={c.status} isArabic={isArabic} />
                      </div>
                      <span className="text-xs font-bold text-[var(--text-secondary)]">
                        {fmtDay(c.work_date, isArabic)} · {copy.types[c.correction_type]}
                      </span>
                    </button>
                  ))}

                  {filtered.length === 0 && (
                    <div className="px-4 py-14 text-center text-sm font-bold text-[var(--text-secondary)]">
                      {rows.length === 0 ? copy.none : copy.noMatch}
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="flex h-[720px] flex-col overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
                {selected ? (
                  <>
                    <div className="flex items-center justify-between gap-3 border-b border-[var(--border-default)] bg-[var(--surface-muted)] px-6 py-5">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white shadow-sm">
                          <UserRound size={20} />
                        </span>
                        <div className="min-w-0">
                          <h2 className="truncate text-lg font-black">{selected.userName}</h2>
                          <p className="text-[11px] font-black text-[var(--brand-primary)]">{copy.types[selected.correction_type]}</p>
                        </div>
                      </div>
                      <StatusBadge status={selected.status} isArabic={isArabic} />
                    </div>

                    <div className="flex-1 space-y-5 overflow-y-auto p-6 text-sm">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4">
                          <span className="flex items-center gap-2 text-xs font-black text-[var(--text-muted)]">
                            <CalendarClock size={14} /> {copy.shiftDate}
                          </span>
                          <p className="mt-2 font-black">{fmtDay(selected.work_date, isArabic)}</p>
                        </div>
                        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4">
                          <span className="flex items-center gap-2 text-xs font-black text-[var(--text-muted)]">
                            <FileText size={14} /> {copy.requestType}
                          </span>
                          <p className="mt-2 font-black">{copy.types[selected.correction_type]}</p>
                        </div>
                      </div>

                      {TIME_TYPES.includes(selected.correction_type) ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4">
                            <span className="mb-2 block text-xs font-black text-[var(--text-muted)]">{copy.orig}</span>
                            <div className="font-bold">{pair(selected.original_value)}</div>
                          </div>
                          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                            <span className="mb-2 block text-xs font-black text-blue-700">{copy.prop}</span>
                            <div className="font-bold text-blue-900">{pair(selected.proposed_value)}</div>
                          </div>
                        </div>
                      ) : (
                        <p className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4 text-xs font-bold leading-6 text-[var(--text-secondary)]">
                          {copy.noTimes}
                        </p>
                      )}

                      <div>
                        <h3 className="mb-2 text-xs font-black text-[var(--text-muted)]">{copy.reason}</h3>
                        <p className="whitespace-pre-wrap rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4 leading-7">
                          {selected.reason}
                        </p>
                      </div>

                      {selected.reviewedByName && (
                        <div className="rounded-2xl border border-[var(--border-default)] p-4">
                          <h3 className="text-xs font-black text-[var(--text-muted)]">{copy.decision}</h3>
                          <p className="mt-2 text-xs font-bold text-[var(--text-secondary)]">
                            {copy.by}: <b className="text-[var(--text-primary)]">{selected.reviewedByName}</b>
                            {selected.decision_note ? ` — ${selected.decision_note}` : ""}
                          </p>
                        </div>
                      )}
                    </div>

                    {selected.status === "pending" && (
                      <div className="space-y-3 border-t border-[var(--border-default)] bg-[var(--surface-muted)] p-5">
                        {TIME_TYPES.includes(selected.correction_type) && (
                          <p className="text-[11px] font-bold text-[var(--text-muted)]">{copy.approveHint}</p>
                        )}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                          <input
                            className={`${inputCls} flex-1`}
                            placeholder={copy.note}
                            maxLength={500}
                            value={notes[selected.id] ?? ""}
                            onChange={(e) => setNotes({ ...notes, [selected.id]: e.target.value })}
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={busyId === selected.id}
                              onClick={() => void decide(selected, "approve")}
                              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 text-sm font-black text-white transition hover:opacity-90 disabled:opacity-50"
                            >
                              <Check size={16} /> {copy.approve}
                            </button>
                            <button
                              type="button"
                              disabled={busyId === selected.id}
                              onClick={() => void decide(selected, "reject")}
                              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-5 text-sm font-black text-[var(--text-secondary)] transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"
                            >
                              <X size={16} /> {copy.reject}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center px-6 text-center text-sm font-bold text-[var(--text-secondary)]">
                    {copy.pick}
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