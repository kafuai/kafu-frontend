"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Inbox,
  LoaderCircle,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";

type Step = {
  order: number;
  name: string | null;
  approvers: string[];
  skipped: boolean;
  skipReason: string | null;
  decision: { decision: string; note: string | null; by: string; at: string } | null;
};

type RequestItem = {
  id: string;
  requestType: string;
  title: string;
  status: string;
  description: string;
  createdAt: number;
  startDate?: number;
  endDate?: number;
  workDate?: string;
  leaveType?: string;
  correctionType?: string;
  decisionNote?: string | null;
  responseData?: Record<string, unknown> | null;
  reviewedByName?: string | null;
  reviewedAt?: number | null;
  approval?: {
    status: string;
    currentStep: number | null;
    totalSteps: number;
    effectStatus: string;
    steps: Step[];
  } | null;
};

const labels: Record<string, { ar: string; en: string }> = {
  leave: { ar: "إجازة", en: "Leave" },
  attendance_correction: { ar: "تصحيح حضور", en: "Attendance correction" },
  employment_letter: { ar: "خطاب تعريف", en: "Employment letter" },
  inquiry: { ar: "استفسار", en: "Inquiry" },
  data_update: { ar: "تحديث بيانات", en: "Data update" },
};

const ghostBtn =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-4 text-sm font-black text-[var(--text-secondary)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] disabled:cursor-not-allowed disabled:opacity-60";

const sectionTitle = "flex items-center gap-2 text-sm font-black text-[var(--text-primary)]";
const infoBox = "rounded-2xl border border-[var(--border-default)] bg-[var(--background)] p-4";
const labelCls = "text-[11px] font-bold text-[var(--text-muted)]";

export default function MyRequestsPage() {
  const { locale } = useLocalization();
  const ar = locale === "ar";

  const [items, setItems] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/employee-experience/my-requests", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || (ar ? "تعذر تحميل الطلبات" : "Unable to load requests"));
      }

      const data = (payload.data ?? []) as RequestItem[];
      setItems(data);
      setSelectedId((current) => (data.some((r) => r.id === current) ? current : data[0]?.id ?? ""));
    } catch (e) {
      setError(e instanceof Error ? e.message : (ar ? "حدث خطأ غير متوقع" : "Unexpected error"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((r) => r.status === filter)),
    [items, filter]
  );

  const selected = filtered.find((r) => r.id === selectedId) ?? filtered[0] ?? null;

  const date = (value: number | string) =>
    new Intl.DateTimeFormat(ar ? "en-US" : "en-US", {
      dateStyle: "medium",
      timeStyle: typeof value === "number" ? "short" : undefined,
    }).format(new Date(value));

  const statusLabels: Record<string, string> = {
    pending: ar ? "قيد المراجعة" : "Pending",
    approved: ar ? "تمت الموافقة" : "Approved",
    rejected: ar ? "مرفوض" : "Rejected",
    completed: ar ? "مكتمل" : "Completed",
    cancelled: ar ? "ملغي" : "Cancelled",
  };

  const statusText = (status: string) => statusLabels[status] || status;

  const statusStyle = (status: string) =>
    status === "approved" || status === "completed"
      ? "bg-[var(--success-background)] text-[var(--success)]"
      : status === "rejected"
      ? "bg-[var(--critical-background)] text-[var(--critical)]"
      : status === "cancelled"
      ? "bg-[var(--surface-muted)] text-[var(--text-muted)]"
      : "bg-[var(--warning-background)] text-[var(--warning)]";

  const titleOf = (item: RequestItem) =>
    labels[item.requestType]?.[ar ? "ar" : "en"] || item.title || item.requestType;

  const StatusBadge = ({ status, large = false }: { status: string; large?: boolean }) => (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full font-extrabold ${
        large ? "px-3 py-1.5 text-xs" : "px-2.5 py-1 text-[10px]"
      } ${statusStyle(status)}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {statusText(status)}
    </span>
  );

  const stats = [
    { key: "all", label: ar ? "كل الطلبات" : "All requests", value: items.length, code: "ALL" },
    { key: "pending", label: ar ? "قيد المراجعة" : "Pending", value: items.filter((r) => r.status === "pending").length, code: "PD" },
    { key: "approved", label: ar ? "معتمدة" : "Approved", value: items.filter((r) => r.status === "approved").length, code: "AP" },
    { key: "rejected", label: ar ? "مرفوضة" : "Rejected", value: items.filter((r) => r.status === "rejected").length, code: "RJ" },
  ];

  return (
    <main
      dir={ar ? "rtl" : "ltr"}
      className="min-h-[calc(100vh-76px)] bg-[var(--background)] text-[var(--text-primary)]"
    >
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
          <div className="absolute inset-y-0 start-0 w-1 bg-[var(--brand-primary)]" />
          <div className="grid gap-6 px-6 py-7 md:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:py-8">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--brand-subtle)] px-3 py-1.5 text-[11px] font-black text-[var(--brand-primary)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--brand-primary)]" />
                  {ar ? "تجربة الموظف" : "EMPLOYEE EXPERIENCE"}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
                {ar ? "طلباتي" : "My Requests"}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] md:text-base md:leading-8">
                {ar
                  ? "تابع جميع طلباتك وحالتها ومسار الموافقات من مكان واحد."
                  : "Track all your requests, their status, and approval progress in one place."}
              </p>
            </div>

            <button type="button" onClick={() => void load()} disabled={loading} className={ghostBtn}>
              {loading ? <LoaderCircle size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              {ar ? "تحديث" : "Refresh"}
            </button>
          </div>
        </section>

        {/* Stats / Filters */}
        <section className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
          {stats.map((stat) => {
            const active = filter === stat.key;
            return (
              <button
                key={stat.key}
                type="button"
                onClick={() => setFilter(stat.key)}
                className={`group relative overflow-hidden rounded-2xl border bg-[var(--surface)] p-5 text-start shadow-[var(--shadow-small)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:shadow-[var(--shadow-medium)] ${
                  active ? "border-[var(--brand-primary)]" : "border-[var(--border-default)]"
                }`}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-0.5 origin-start bg-[var(--brand-primary)] transition-transform duration-200 ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-black text-[var(--text-muted)]">{stat.label}</p>
                    <h2 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">{stat.value}</h2>
                  </div>
                  <span
                    className={`flex h-9 min-w-9 shrink-0 items-center justify-center rounded-xl border px-1.5 text-[10px] font-black ${
                      active
                        ? "border-transparent bg-[var(--brand-primary)] text-white"
                        : "border-[var(--border-default)] bg-[var(--surface-muted)] text-[var(--brand-primary)]"
                    }`}
                  >
                    {stat.code}
                  </span>
                </div>
              </button>
            );
          })}
        </section>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-2xl border border-red-200 bg-[var(--critical-background)] px-4 py-3 text-sm font-bold text-[var(--critical)]"
          >
            {error}
          </div>
        )}

        {loading ? (
          <section className="mt-5 rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow-small)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-subtle)]">
              <LoaderCircle size={22} className="animate-spin text-[var(--brand-primary)]" />
            </div>
            <p className="mt-4 text-base font-black">
              {ar ? "جارٍ تحميل طلباتك..." : "Loading your requests..."}
            </p>
          </section>
        ) : (
          <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.38fr)]">
            {/* Requests List */}
            <article className="min-w-0 overflow-hidden rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)] xl:self-start">
              <div className="flex items-center justify-between gap-4 border-b border-[var(--border-default)] p-5">
                <div className="flex items-center gap-2">
                  <FileText size={19} className="text-[var(--brand-primary)]" />
                  <h2 className="text-base font-black">{ar ? "طلباتي" : "My Requests"}</h2>
                </div>
                <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-[var(--surface-muted)] px-2 text-xs font-black">
                  {filtered.length}
                </span>
              </div>

              <div className="p-3">
                {filtered.length > 0 ? (
                  <div className="space-y-2">
                    {filtered.map((item) => {
                      const isSelected = selected?.id === item.id;
                      return (
                        <button
                          key={`${item.requestType}:${item.id}`}
                          type="button"
                          onClick={() => setSelectedId(item.id)}
                          className={`group block w-full rounded-2xl border p-4 text-start transition ${
                            isSelected
                              ? "border-blue-200 bg-[var(--brand-subtle)]"
                              : "border-transparent hover:border-[var(--border-default)] hover:bg-[var(--background)]"
                          }`}
                        >
                          <div className="flex min-w-0 items-start gap-3">
                            <span
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                isSelected
                                  ? "bg-[var(--brand-primary)] text-white"
                                  : "bg-[var(--surface-muted)] text-[var(--text-secondary)]"
                              }`}
                            >
                              <FileText size={16} />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex min-w-0 items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-black">{titleOf(item)}</p>
                                  <p className="mt-0.5 truncate text-[11px] text-[var(--text-muted)]">
                                    {labels[item.requestType]?.[ar ? "ar" : "en"] || item.requestType} · {date(item.createdAt)}
                                  </p>
                                </div>
                                <ChevronRight
                                  size={16}
                                  className={`mt-1 shrink-0 transition ${ar ? "rotate-180" : ""} ${
                                    isSelected ? "text-[var(--brand-primary)]" : "text-[var(--text-muted)] opacity-50"
                                  }`}
                                />
                              </div>

                              <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--text-secondary)]">
                                {item.description}
                              </p>

                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                <StatusBadge status={item.status} />
                                {item.approval?.status === "pending" && (
                                  <span className="rounded-md bg-[var(--brand-subtle)] px-2 py-1 text-[10px] font-extrabold text-[var(--brand-primary)]">
                                    {ar
                                      ? `الخطوة ${item.approval.currentStep ?? "—"} من ${item.approval.totalSteps}`
                                      : `Step ${item.approval.currentStep ?? "—"} of ${item.approval.totalSteps}`}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex min-h-56 flex-col items-center justify-center px-6 py-10 text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--text-muted)]">
                      <Inbox size={20} />
                    </span>
                    <p className="mt-4 text-sm font-bold">
                      {ar ? "ما عندك طلبات ضمن هذا التصنيف." : "No requests in this category."}
                    </p>
                  </div>
                )}
              </div>
            </article>

            {/* Request Details */}
            {!selected ? (
              <article className="flex min-h-[500px] items-center justify-center rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-small)]">
                <div>
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--text-muted)]">
                    <Inbox size={23} />
                  </span>
                  <p className="mt-4 font-bold">
                    {ar ? "اختر طلباً لعرض تفاصيله." : "Select a request to see its details."}
                  </p>
                </div>
              </article>
            ) : (
              <article className="min-w-0 overflow-hidden rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
                <div className="border-b border-[var(--border-default)] px-5 py-5 sm:px-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-extrabold text-[var(--brand-primary)]">
                      {ar ? "تفاصيل الطلب" : "REQUEST DETAILS"}
                    </span>
                    <StatusBadge status={selected.status} large />
                  </div>
                  <h2 className="mt-2 text-xl font-black tracking-tight">{titleOf(selected)}</h2>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {ar ? "تاريخ التقديم" : "Submitted"}: {date(selected.createdAt)}
                  </p>
                </div>

                <div className="space-y-5 p-5 sm:p-6">
                  {/* Description */}
                  <section>
                    <h3 className={sectionTitle}>
                      <span className="text-[var(--brand-primary)]"><FileText size={17} /></span>
                      {ar ? "وصف الطلب" : "Request description"}
                    </h3>
                    <div className={`mt-3 ${infoBox}`}>
                      <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--text-secondary)]">
                        {selected.description || (ar ? "لا يوجد وصف إضافي." : "No additional description.")}
                      </p>

                      {(selected.startDate || selected.endDate) && (
                        <div className="mt-4 flex items-start gap-3 border-t border-[var(--border-default)] pt-4">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand-primary)]">
                            <CalendarDays size={17} />
                          </span>
                          <div>
                            <p className={labelCls}>{ar ? "الفترة المطلوبة" : "Requested period"}</p>
                            <p className="mt-0.5 text-sm font-extrabold">
                              {date(selected.startDate || 0)} — {date(selected.endDate || 0)}
                            </p>
                          </div>
                        </div>
                      )}

                      {selected.workDate && (
                        <div className="mt-4 flex items-start gap-3 border-t border-[var(--border-default)] pt-4">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand-primary)]">
                            <CalendarDays size={17} />
                          </span>
                          <div>
                            <p className={labelCls}>{ar ? "تاريخ الحضور" : "Work date"}</p>
                            <p className="mt-0.5 text-sm font-extrabold">{selected.workDate}</p>
                          </div>
                        </div>
                      )}

                      {(selected.leaveType || selected.correctionType) && (
                        <div className="mt-4 grid gap-3 border-t border-[var(--border-default)] pt-4 sm:grid-cols-2">
                          {selected.leaveType && (
                            <div>
                              <p className={labelCls}>{ar ? "نوع الإجازة" : "Leave type"}</p>
                              <p className="mt-0.5 text-sm font-extrabold">{selected.leaveType}</p>
                            </div>
                          )}
                          {selected.correctionType && (
                            <div>
                              <p className={labelCls}>{ar ? "نوع التصحيح" : "Correction type"}</p>
                              <p className="mt-0.5 text-sm font-extrabold">{selected.correctionType}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Approvals Workflow */}
                  <section>
                    <h3 className={sectionTitle}>
                      <span className="text-[var(--brand-primary)]"><Activity size={17} /></span>
                      {ar ? "مسار الطلب والموافقات" : "Request progress"}
                    </h3>

                    {selected.approval ? (
                      <div className="mt-3 space-y-2.5">
                        {selected.approval.steps.map((step) => {
                          const isCurrent =
                            selected.approval?.currentStep === step.order && selected.approval.status === "pending";
                          return (
                            <div
                              key={step.order}
                              className={`flex gap-3 rounded-2xl border p-3.5 ${
                                isCurrent
                                  ? "border-blue-200 bg-[var(--brand-subtle)]"
                                  : "border-[var(--border-default)] bg-[var(--surface-muted)]"
                              }`}
                            >
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                  step.skipped
                                    ? "bg-[var(--surface)] text-[var(--text-muted)]"
                                    : step.decision?.decision === "approved"
                                    ? "bg-[var(--success-background)] text-[var(--success)]"
                                    : step.decision?.decision === "rejected"
                                    ? "bg-[var(--critical-background)] text-[var(--critical)]"
                                    : isCurrent
                                    ? "bg-[var(--warning-background)] text-[var(--warning)]"
                                    : "bg-[var(--surface)] text-[var(--text-muted)]"
                                }`}
                              >
                                {step.decision?.decision === "approved" ? (
                                  <CheckCircle2 size={17} />
                                ) : step.decision?.decision === "rejected" ? (
                                  <XCircle size={17} />
                                ) : (
                                  <Clock3 size={17} />
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-sm font-black">
                                    {step.name || (ar ? `الخطوة ${step.order}` : `Step ${step.order}`)}
                                  </p>
                                  {isCurrent && (
                                    <span className="rounded-full bg-[var(--warning-background)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--warning)]">
                                      {ar ? "الحالية" : "Current"}
                                    </span>
                                  )}
                                </div>
                                <p className="mt-1 text-xs font-bold text-[var(--text-muted)]">
                                  {step.skipped
                                    ? ar ? "تم تخطي الخطوة" : "Step skipped"
                                    : step.approvers.join("، ") || (ar ? "لم يتم تحديد المسؤول بعد" : "Approver not resolved yet")}
                                </p>
                                {step.decision && (
                                  <p className="mt-1 text-xs font-bold text-[var(--text-secondary)]">
                                    {step.decision.decision === "approved" ? (ar ? "تمت الموافقة" : "Approved") : (ar ? "تم الرفض" : "Rejected")} · {step.decision.by}
                                    {step.decision.note ? ` · ${step.decision.note}` : ""}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className={`mt-3 text-sm leading-7 text-[var(--text-secondary)] ${infoBox}`}>
                        {selected.status === "pending"
                          ? (ar ? "الطلب قيد المعالجة، ولا يوجد له مسار موافقات مسجل حالياً." : "This request is being processed; no approval workflow is currently recorded.")
                          : (ar ? "لا يوجد مسار موافقات مرتبط بهذا النوع من الطلبات." : "No approval workflow is associated with this request type.")}
                      </div>
                    )}
                  </section>

                  {/* Notices */}
                  {(selected.approval?.status === "approved" && ["pending", "applying"].includes(selected.approval.effectStatus)) ||
                  selected.approval?.effectStatus === "failed" ||
                  selected.decisionNote ||
                  typeof selected.responseData?.reason === "string" ||
                  selected.reviewedByName ? (
                    <section className="space-y-2.5 border-t border-[var(--border-default)] pt-5">
                      {selected.approval?.status === "approved" && ["pending", "applying"].includes(selected.approval.effectStatus) && (
                        <p className="rounded-2xl bg-[var(--warning-background)] px-4 py-3 text-sm font-bold leading-7 text-[var(--warning)]">
                          {ar ? "تمت الموافقة، وجارٍ تنفيذ الإجراء المرتبط بالطلب." : "Approved; the related action is still being applied."}
                        </p>
                      )}
                      {selected.approval?.effectStatus === "failed" && (
                        <p className="rounded-2xl bg-[var(--critical-background)] px-4 py-3 text-sm font-bold leading-7 text-[var(--critical)]">
                          {ar ? "تم اتخاذ القرار لكن تعذر تنفيذ أثر الموافقة على الطلب. يرجى مراجعة الموارد البشرية." : "The decision was recorded but its effect failed. Please contact HR."}
                        </p>
                      )}
                      {selected.decisionNote && (
                        <p className={`text-sm leading-7 text-[var(--text-secondary)] ${infoBox}`}>
                          <span className="font-black text-[var(--text-primary)]">{ar ? "ملاحظة القرار:" : "Decision note:"}</span>{" "}
                          {selected.decisionNote}
                        </p>
                      )}
                      {typeof selected.responseData?.reason === "string" && (
                        <p className={`text-sm leading-7 text-[var(--text-secondary)] ${infoBox}`}>
                          <span className="font-black text-[var(--text-primary)]">{ar ? "رد الموارد البشرية:" : "HR response:"}</span>{" "}
                          {selected.responseData.reason}
                        </p>
                      )}
                      {selected.reviewedByName && (
                        <p className="text-center text-[11px] font-bold leading-5 text-[var(--text-muted)]">
                          {ar ? "تمت المراجعة بواسطة:" : "Reviewed by:"} {selected.reviewedByName}
                          {selected.reviewedAt ? ` · ${date(selected.reviewedAt)}` : ""}
                        </p>
                      )}
                    </section>
                  ) : null}
                </div>
              </article>
            )}
          </section>
        )}
      </div>
    </main>
  );
}