"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Check, Edit, FileText, Receipt, Settings, ShieldAlert, UserRound, X } from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { api, fmtDay, fmtMoney, StatusBadge, todayKey } from "@/components/attendance/shared";

/* ------------------------------ constants ------------------------------ */

const OPEN = ["needs_review", "in_review", "needs_extra_approval", "apply_failed"];
const INCIDENTS = ["late", "early_leave", "absence"] as const;
const STATUS_FILTERS = ["needs_review", "in_review", "needs_extra_approval", "apply_failed", "approved", "rejected"] as const;

const labelCls = "block text-xs font-black text-[var(--text-secondary)]";
const inputCls =
  "mt-1 block h-11 w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm font-bold text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:bg-[var(--surface)]";
const textareaCls =
  "mt-1 block w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-3 py-2.5 text-sm font-bold text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:bg-[var(--surface)]";
const primaryBtn =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";
const ghostBtn =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-5 text-sm font-black text-[var(--text-secondary)] transition hover:border-[var(--brand-primary)] hover:bg-[var(--brand-subtle)] disabled:cursor-not-allowed disabled:opacity-50";
const dangerBtn =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-5 text-sm font-black text-[var(--text-secondary)] transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-50";

/* -------------------------------- page -------------------------------- */

export default function AttendanceDeductionsPage() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";

  const copy = isArabic
    ? {
        badge: "ATTENDANCE", badgeSub: "مراجعة الخصومات",
        heroTitle: "مراجعة خصومات الحضور",
        heroText: "راجع مقترحات الخصم الناتجة عن التأخير والانصراف المبكر والغياب. لا يدخل أي خصم إلى الرواتب إلا بعد اعتمادك، ويبقى كل قرار موثّقًا.",
        chips: ["لا خصم بدون اعتماد", "قرار موثّق", "سياسات احتساب معتمدة"],
        tabReview: "المقترحات", tabPolicies: "سياسات الحساب",
        statReview: "بانتظار قرارك", statReviewNote: "مقترحات تحتاج إلى مراجعة",
        statExtra: "اعتماد إضافي", statExtraNote: "لا يمكن اعتمادها من صاحبها",
        statFail: "تعذّر إدراجها", statFailNote: "تحتاج إلى معالجة قبل المسير",
        statReady: "معتمد وجاهز للمسير", statReadyNote: "إجمالي المبالغ غير المدرجة بعد",
        listTitle: "المقترحات", search: "ابحث باسم الموظف", all: "كل الحالات",
        none: "لا توجد مقترحات.", noMatch: "لا نتائج مطابقة.",
        pick: "اختر مقترحًا من القائمة لعرض تفاصيله واتخاذ قرار.",
        loadingTitle: "جارٍ تحميل الخصومات", loadingText: "يتم جلب المقترحات وسياسات الحساب.",
        errorTitle: "تعذر تحميل البيانات", retry: "إعادة المحاولة",
        incident: "الواقعة", amount: "المبلغ", explain: "طريقة الحساب",
        orig: "المبلغ الأصلي", finalAmt: "المبلغ المعتمد (المعدّل)", adjReason: "سبب التعديل", decisionNote: "ملاحظة القرار",
        approve: "اعتماد", reject: "رفض", adjust: "تعديل المبلغ", cancel: "إلغاء",
        newAmount: "المبلغ الجديد", diff: "الفرق عن الأصلي", reasonPh: "اكتب سبب التعديل...",
        confirm: "أؤكد اعتماد المبلغ المعدّل", save: "حفظ القرار", saving: "جارٍ الحفظ...",
        inPayroll: "أُدرج في المسير", saved: "تم حفظ القرار.", policySaved: "تم اعتماد السياسة.",
        noAmount: "لا يوجد مبلغ محسوب (لا سياسة معتمدة)", awaiting: "بانتظار المبلغ",
        needsAmountHint: "لا يوجد مبلغ محسوب لهذه الواقعة. حدّد المبلغ يدويًا عبر «تعديل المبلغ» مع ذكر السبب.",
        extraHint: "هذا الخصم يخص حسابك أنت. لا يمكنك اعتماده أو رفضه بنفسك، ويحتاج إلى owner آخر.",
        decidedBy: "قرار بواسطة", minShort: "د",
        types: { late: "تأخير", early_leave: "انصراف مبكر", absence: "غياب" } as Record<string, string>,
        statuses: {
          needs_review: "يحتاج إلى مراجعة", in_review: "قيد المراجعة", needs_extra_approval: "يحتاج اعتمادًا إضافيًا",
          apply_failed: "تعذّر إدراجه", approved: "معتمد", rejected: "مرفوض",
        } as Record<string, string>,
        method: "طريقة الحساب", value: "القيمة", basis: "أساس الأجر", minMin: "الحد الأدنى (د)", max: "الحد الأقصى للمبلغ",
        noMax: "بدون حد", setPolicy: "اعتماد السياسة", noPolicy: "لا توجد سياسة معتمدة", activePolicy: "فعّالة",
        polHint: "بدون سياسة معتمدة لا يُحسب أي مبلغ، وتبقى الواقعة للمراجعة اليدوية. تغيير السياسة لا يمس مقترحات تم اتخاذ قرار عليها.",
        pctWarn: "النسبة لا يمكن أن تتجاوز 100.",
        methods: { fixed_amount: "مبلغ ثابت", percent_of_daily_wage: "نسبة من الأجر اليومي", per_minute_of_daily_wage: "بالدقيقة (معامل)" } as Record<string, string>,
        bases: { basic: "الأساسي", basic_plus_housing: "الأساسي + السكن", gross: "الإجمالي" } as Record<string, string>,
      }
    : {
        badge: "ATTENDANCE", badgeSub: "Deduction review",
        heroTitle: "Attendance Deduction Review",
        heroText: "Review deduction proposals created from lateness, early leave and absence. No deduction reaches payroll until you approve it, and every decision is documented.",
        chips: ["No deduction without approval", "Documented decision", "Approved calculation policies"],
        tabReview: "Proposals", tabPolicies: "Calculation policies",
        statReview: "Awaiting your decision", statReviewNote: "Proposals that need review",
        statExtra: "Extra approval", statExtraNote: "Cannot be approved by their owner",
        statFail: "Apply failed", statFailNote: "Need handling before payroll",
        statReady: "Approved & ready for payroll", statReadyNote: "Total not yet included",
        listTitle: "Proposals", search: "Search by employee name", all: "All statuses",
        none: "No proposals.", noMatch: "No matching results.",
        pick: "Select a proposal from the list to view details and decide.",
        loadingTitle: "Loading deductions", loadingText: "Fetching proposals and calculation policies.",
        errorTitle: "Unable to load data", retry: "Retry",
        incident: "Incident", amount: "Amount", explain: "Calculation",
        orig: "Original amount", finalAmt: "Approved (adjusted) amount", adjReason: "Adjustment reason", decisionNote: "Decision note",
        approve: "Approve", reject: "Reject", adjust: "Adjust amount", cancel: "Cancel",
        newAmount: "New amount", diff: "Difference from original", reasonPh: "Write the adjustment reason...",
        confirm: "I confirm the adjusted amount", save: "Save decision", saving: "Saving...",
        inPayroll: "Included in payroll", saved: "Decision saved.", policySaved: "Policy approved.",
        noAmount: "No calculated amount (no approved policy)", awaiting: "Amount pending",
        needsAmountHint: "There is no calculated amount for this incident. Set the amount manually via “Adjust amount” with a reason.",
        extraHint: "This deduction is about your own account. You cannot approve or reject it yourself; another owner must.",
        decidedBy: "Decided by", minShort: "min",
        types: { late: "Late", early_leave: "Early leave", absence: "Absence" } as Record<string, string>,
        statuses: {
          needs_review: "Needs review", in_review: "In review", needs_extra_approval: "Needs extra approval",
          apply_failed: "Apply failed", approved: "Approved", rejected: "Rejected",
        } as Record<string, string>,
        method: "Method", value: "Value", basis: "Wage basis", minMin: "Minimum (min)", max: "Maximum amount",
        noMax: "No limit", setPolicy: "Approve policy", noPolicy: "No approved policy", activePolicy: "Active",
        polHint: "Without an approved policy no amount is calculated and incidents stay for manual review. Changing a policy never touches proposals that were already decided.",
        pctWarn: "Percent cannot exceed 100.",
        methods: { fixed_amount: "Fixed amount", percent_of_daily_wage: "% of daily wage", per_minute_of_daily_wage: "Per minute (multiplier)" } as Record<string, string>,
        bases: { basic: "Basic", basic_plus_housing: "Basic + housing", gross: "Gross" } as Record<string, string>,
      };

  const [tab, setTab] = useState<"review" | "policies">("review");
  const [rows, setRows] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const [status, setStatus] = useState<string>("needs_review");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adj, setAdj] = useState({ amount: "", reason: "", confirm: false });
  const [pf, setPf] = useState<Record<string, any>>({});

  const load = useCallback(async () => {
    try {
      const [p, pol] = await Promise.all([api("/api/attendance/proposals"), api("/api/attendance/policies")]);
      setRows(p.data ?? []);
      setPolicies(pol.data ?? []);
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

  // نُبقي المقترح المحدد إن كان ما زال ظاهرًا، وإلا ننتقل لأول مقترح
  useEffect(() => {
    if (filtered.length === 0) {
      if (selectedId) setSelectedId("");
      return;
    }
    if (!filtered.some((r) => r.id === selectedId)) setSelectedId(filtered[0].id);
  }, [filtered, selectedId]);

  useEffect(() => {
    setIsAdjusting(false);
  }, [selectedId]);

  const selected = filtered.find((r) => r.id === selectedId) ?? null;

  const stats = useMemo(() => {
    const ready = rows
      .filter((r) => r.status === "approved" && !r.appliedToPayroll)
      .reduce((sum, r) => sum + Number(r.final_amount ?? 0), 0);
    return [
      { code: "REV", label: copy.statReview, value: String(rows.filter((r) => ["needs_review", "in_review"].includes(r.status)).length), note: copy.statReviewNote },
      { code: "EXT", label: copy.statExtra, value: String(rows.filter((r) => r.status === "needs_extra_approval").length), note: copy.statExtraNote },
      { code: "ERR", label: copy.statFail, value: String(rows.filter((r) => r.status === "apply_failed").length), note: copy.statFailNote },
      { code: "SAR", label: copy.statReady, value: fmtMoney(ready, isArabic), note: copy.statReadyNote },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, isArabic]);

  async function decide(id: string, body: object) {
    setBusy(true);
    setMsg(null);
    try {
      await api(`/api/attendance/proposals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setMsg({ kind: "ok", text: copy.saved });
      setIsAdjusting(false);
      await load();
    } catch (e) {
      setMsg({ kind: "error", text: e instanceof Error ? e.message : "Error" });
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function savePolicy(type: string, f: any) {
    setBusy(true);
    setMsg(null);
    try {
      await api("/api/attendance/policies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incidentType: type,
          method: f.method,
          value: Number(f.value),
          wageBasis: f.wageBasis,
          minMinutes: Number(f.minMinutes || 0),
          maxAmount: f.maxAmount === "" || f.maxAmount === null ? null : Number(f.maxAmount),
          effectiveFrom: todayKey(),
        }),
      });
      setMsg({ kind: "ok", text: copy.policySaved });
      setPf((s) => {
        const { [type]: _drop, ...rest } = s;
        return rest;
      });
      await load();
    } catch (e) {
      setMsg({ kind: "error", text: e instanceof Error ? e.message : "Error" });
    } finally {
      setBusy(false);
    }
  }

  const bannerCls = (kind: "ok" | "error") =>
    kind === "ok" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-700";

  const amountOf = (p: any) => p.final_amount ?? p.original_amount;

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
                      <h2 className="mt-3 break-words text-2xl font-black tracking-tight md:text-3xl">{card.value}</h2>
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

            {/* ------------------------------- Tabs ------------------------------- */}
            <div className="mt-5 flex flex-wrap gap-2">
              {([["review", copy.tabReview], ["policies", copy.tabPolicies]] as const).map(([k, label]) => (
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
                  {k === "review" ? <ShieldAlert size={16} /> : <Settings size={16} />}
                  {label}
                </button>
              ))}
            </div>

            {/* ============================= Proposals ============================= */}
            {tab === "review" && (
              <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.38fr)]">
                {/* List */}
                <div className="flex h-[740px] flex-col overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
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
                    {filtered.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedId(p.id)}
                        className={`flex w-full flex-col items-start gap-2 rounded-2xl border p-4 text-start transition ${
                          selectedId === p.id
                            ? "border-[var(--brand-primary)] bg-[var(--brand-subtle)]"
                            : "border-[var(--border-default)] bg-[var(--surface)] hover:border-[var(--brand-primary)]"
                        }`}
                      >
                        <div className="flex w-full items-center justify-between gap-2">
                          <span className="flex min-w-0 items-center gap-2 font-black">
                            <UserRound size={15} className="shrink-0 text-[var(--brand-primary)]" />
                            <span className="truncate">{p.userName}</span>
                          </span>
                          <StatusBadge status={p.status} isArabic={isArabic} />
                        </div>
                        <div className="flex w-full items-center justify-between gap-2 text-xs">
                          <span className="font-bold text-[var(--text-secondary)]">
                            {fmtDay(p.incident_date, isArabic)} · {copy.types[p.incident_type]}
                            {p.minutes ? ` (${p.minutes} ${copy.minShort})` : ""}
                          </span>
                          <span className="shrink-0 font-black">
                            {amountOf(p) === null ? copy.awaiting : fmtMoney(amountOf(p), isArabic)}
                          </span>
                        </div>
                      </button>
                    ))}

                    {filtered.length === 0 && (
                      <div className="px-4 py-16 text-center text-sm font-bold text-[var(--text-secondary)]">
                        <Receipt size={32} className="mx-auto mb-3 opacity-30" />
                        {rows.length === 0 ? copy.none : copy.noMatch}
                      </div>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="flex h-[740px] flex-col overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
                  {selected ? (() => {
                    const p = selected;
                    const open = OPEN.includes(p.status) && !p.appliedToPayroll;
                    const newAmt = Number(adj.amount);
                    const adjusted = p.final_amount !== null && p.original_amount !== p.final_amount;

                    return (
                      <>
                        <div className="flex items-center justify-between gap-3 border-b border-[var(--border-default)] bg-[var(--surface-muted)] px-6 py-5">
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white shadow-sm">
                              <UserRound size={20} />
                            </span>
                            <div className="min-w-0">
                              <h2 className="truncate text-lg font-black">{p.userName}</h2>
                              <p className="text-[11px] font-black text-[var(--brand-primary)]">{copy.types[p.incident_type]}</p>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            {p.appliedToPayroll && (
                              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-black text-emerald-800">
                                {copy.inPayroll}
                              </span>
                            )}
                            <StatusBadge status={p.status} isArabic={isArabic} />
                          </div>
                        </div>

                        <div className="flex-1 space-y-5 overflow-y-auto p-6 text-sm">
                          <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 font-black text-rose-700">
                            <AlertCircle size={18} className="shrink-0" />
                            <span>
                              {copy.types[p.incident_type]} — {fmtDay(p.incident_date, isArabic)}
                              {p.minutes ? ` (${p.minutes} ${copy.minShort})` : ""}
                            </span>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4">
                              <span className="mb-2 block text-xs font-black text-[var(--text-muted)]">{copy.orig}</span>
                              <span className="text-lg font-black">
                                {p.original_amount === null ? copy.noAmount : fmtMoney(p.original_amount, isArabic)}
                              </span>
                            </div>
                            {adjusted && (
                              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                                <span className="mb-2 block text-xs font-black text-blue-700">{copy.finalAmt}</span>
                                <span className="text-lg font-black text-blue-900">{fmtMoney(p.final_amount, isArabic)}</span>
                              </div>
                            )}
                          </div>

                          {open && p.original_amount === null && (
                            <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold leading-6 text-amber-900">
                              {copy.needsAmountHint}
                            </p>
                          )}
                          {p.status === "needs_extra_approval" && (
                            <p className="rounded-2xl border border-purple-200 bg-purple-50 p-4 text-xs font-bold leading-6 text-purple-900">
                              {copy.extraHint}
                            </p>
                          )}

                          {p.explanation && (
                            <div>
                              <h3 className="mb-2 text-xs font-black text-[var(--text-muted)]">{copy.explain}</h3>
                              <p className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4 leading-7">
                                {p.explanation}
                              </p>
                            </div>
                          )}

                          {p.adjustment_reason && (
                            <div>
                              <h3 className="mb-2 text-xs font-black text-[var(--text-muted)]">{copy.adjReason}</h3>
                              <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 leading-7 text-amber-900">
                                {p.adjustment_reason}
                              </p>
                            </div>
                          )}

                          {(p.decidedByName || p.decision_note) && (
                            <div className="rounded-2xl border border-[var(--border-default)] p-4">
                              <h3 className="text-xs font-black text-[var(--text-muted)]">{copy.decisionNote}</h3>
                              <p className="mt-2 text-xs font-bold text-[var(--text-secondary)]">
                                {p.decidedByName && <>{copy.decidedBy}: <b className="text-[var(--text-primary)]">{p.decidedByName}</b></>}
                                {p.decision_note ? ` — ${p.decision_note}` : ""}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        {open && !isAdjusting && (
                          <div className="flex flex-wrap gap-3 border-t border-[var(--border-default)] bg-[var(--surface-muted)] p-5">
                            {p.original_amount !== null && (
                              <button type="button" className={primaryBtn} disabled={busy} onClick={() => void decide(p.id, { action: "approve" })}>
                                <Check size={16} /> {copy.approve}
                              </button>
                            )}
                            <button
                              type="button"
                              className={ghostBtn}
                              disabled={busy}
                              onClick={() => { setIsAdjusting(true); setAdj({ amount: String(p.original_amount ?? ""), reason: "", confirm: false }); }}
                            >
                              <Edit size={16} /> {copy.adjust}
                            </button>
                            <button type="button" className={dangerBtn} disabled={busy} onClick={() => void decide(p.id, { action: "reject" })}>
                              <X size={16} /> {copy.reject}
                            </button>
                          </div>
                        )}

                        {open && isAdjusting && (
                          <div className="space-y-4 border-t border-[var(--border-default)] bg-[var(--surface-muted)] p-5">
                            <h3 className="text-sm font-black">{copy.adjust}</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <label className={labelCls}>
                                {copy.newAmount}
                                <input
                                  type="number" min={0} step="0.01" dir="ltr" className={inputCls}
                                  value={adj.amount} onChange={(e) => setAdj({ ...adj, amount: e.target.value })}
                                />
                              </label>
                              <div className="flex items-end pb-3 text-xs font-bold text-[var(--text-secondary)]">
                                {p.original_amount !== null && Number.isFinite(newAmt) && adj.amount !== "" && (
                                  <span>{copy.diff}: <b dir="ltr" className="text-[var(--text-primary)]">{fmtMoney(newAmt - Number(p.original_amount), isArabic)}</b></span>
                                )}
                              </div>
                            </div>
                            <label className={labelCls}>
                              {copy.adjReason}
                              <textarea
                                rows={2} className={textareaCls} placeholder={copy.reasonPh}
                                value={adj.reason} onChange={(e) => setAdj({ ...adj, reason: e.target.value })}
                              />
                            </label>
                            <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-[var(--text-secondary)]">
                              <input
                                type="checkbox" className="h-4 w-4 accent-[var(--brand-primary)]"
                                checked={adj.confirm} onChange={(e) => setAdj({ ...adj, confirm: e.target.checked })}
                              />
                              {copy.confirm}
                            </label>
                            <div className="flex flex-wrap gap-3">
                              <button
                                type="button"
                                className={primaryBtn}
                                disabled={busy || !adj.confirm || adj.reason.trim().length < 3 || !(newAmt > 0)}
                                onClick={() => void decide(p.id, { action: "adjust", amount: newAmt, reason: adj.reason, confirm: true })}
                              >
                                {busy ? copy.saving : copy.save}
                              </button>
                              <button type="button" className={ghostBtn} disabled={busy} onClick={() => setIsAdjusting(false)}>
                                {copy.cancel}
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })() : (
                    <div className="flex h-full flex-col items-center justify-center px-6 text-center text-sm font-bold text-[var(--text-secondary)]">
                      <FileText size={40} className="mb-4 opacity-30" />
                      {copy.pick}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ============================== Policies ============================== */}
            {tab === "policies" && (
              <>
                <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold leading-7 text-blue-800">
                  {copy.polHint}
                </div>

                <section className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
                  {INCIDENTS.map((type) => {
                    const cur = policies.find((p) => p.incident_type === type);
                    const f = pf[type] ?? {
                      method: cur?.method ?? "fixed_amount",
                      value: cur?.value ?? "",
                      wageBasis: cur?.wage_basis ?? "gross",
                      minMinutes: cur?.min_minutes ?? 0,
                      maxAmount: cur?.max_amount ?? "",
                    };
                    const set = (patch: object) => setPf({ ...pf, [type]: { ...f, ...patch } });
                    const pctTooHigh = f.method === "percent_of_daily_wage" && Number(f.value) > 100;

                    return (
                      <article
                        key={type}
                        className="flex flex-col overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]"
                      >
                        <div className="flex items-center justify-between gap-3 border-b border-[var(--border-default)] bg-[var(--surface-muted)] px-5 py-4">
                          <h2 className="text-sm font-black">{copy.types[type]}</h2>
                          {cur ? (
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-black text-emerald-800">{copy.activePolicy}</span>
                          ) : (
                            <span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-[11px] font-black text-[var(--text-secondary)]">{copy.noPolicy}</span>
                          )}
                        </div>

                        <div className="flex-1 space-y-4 p-5">
                          <label className={labelCls}>
                            {copy.method}
                            <select className={inputCls} value={f.method} onChange={(e) => set({ method: e.target.value })}>
                              {Object.entries(copy.methods).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                          </label>

                          <div className="grid grid-cols-2 gap-4">
                            <label className={labelCls}>
                              {copy.value}
                              <input
                                type="number" min={0} step="0.01" dir="ltr" className={inputCls}
                                value={f.value} onChange={(e) => set({ value: e.target.value })}
                              />
                            </label>
                            <label className={labelCls}>
                              {copy.basis}
                              <select className={inputCls} value={f.wageBasis} onChange={(e) => set({ wageBasis: e.target.value })}>
                                {Object.entries(copy.bases).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                              </select>
                            </label>
                          </div>

                          {pctTooHigh && <p className="text-[11px] font-black text-rose-600">{copy.pctWarn}</p>}

                          <div className="grid grid-cols-2 gap-4">
                            <label className={labelCls}>
                              {copy.minMin}
                              <input
                                type="number" min={0} className={inputCls}
                                value={f.minMinutes} onChange={(e) => set({ minMinutes: e.target.value })}
                              />
                            </label>
                            <label className={labelCls}>
                              {copy.max}
                              <input
                                type="number" min={0} step="0.01" dir="ltr" placeholder={copy.noMax} className={inputCls}
                                value={f.maxAmount} onChange={(e) => set({ maxAmount: e.target.value })}
                              />
                            </label>
                          </div>
                        </div>

                        <div className="border-t border-[var(--border-default)] bg-[var(--surface-muted)] p-5">
                          <button
                            type="button"
                            className={`${primaryBtn} w-full`}
                            disabled={busy || f.value === "" || pctTooHigh}
                            onClick={() => void savePolicy(type, f)}
                          >
                            <Check size={16} /> {busy ? copy.saving : copy.setPolicy}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </section>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}