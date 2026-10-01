"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Bot,
  BrainCircuit,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  Inbox,
  Loader2,
  MessageSquareText,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type RequestStatus = "pending" | "approved" | "rejected" | "cancelled";

function formatShortReference(id: string): string {
  const shortId = id.replace(/-/g, "").slice(-6).toUpperCase();
  return `REQ-${shortId}`;
}

type EmployeeRequest = {
  id: string;
  employeeId: string;
  employeeName: string;
  requestType: "leave" | "employment_letter";
  title: string;
  description: string;
  status: RequestStatus;
  createdAt: string;
  requestedDates?: string;
};

type ApiLeaveRequest = {
  id: string;
  employeeId: string;
  employeeName: string;
  requestType: "leave" | "employment_letter";
  status: RequestStatus;
  reason: string;
  startDate: number;
  endDate: number;
  createdAt: number;
};

/* -------------------------------------------------------------------------- */
/*                                Main Page                                   */
/* -------------------------------------------------------------------------- */

export default function EmployeeExperienceRequestsPage() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";

  const [requests, setRequests] = useState<EmployeeRequest[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">(
    "loading",
  );
  const [loadError, setLoadError] = useState<string>("");

  const [selectedRequestId, setSelectedRequestId] = useState<string>("");
  const [actionState, setActionState] = useState<"idle" | "working" | "error">("idle");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">(
    "all",
  );

  function formatDate(timestamp: number) {
    return new Intl.DateTimeFormat(isArabic ? "ar-SA" : "en-US", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));
  }

  function mapApiRequest(item: ApiLeaveRequest): EmployeeRequest {
  const isLeave = item.requestType === "leave";

  return {
    id: item.id,
    employeeId: item.employeeId,
    employeeName: item.employeeName, 
    requestType: item.requestType,
    title: isLeave
      ? (isArabic ? "طلب إجازة" : "Leave request")
      : (isArabic ? "طلب خطاب تعريف" : "Employment letter request"),
    description: item.reason,
    status: item.status,
    createdAt: formatDate(item.createdAt),
    requestedDates:
      isLeave && item.startDate && item.endDate
        ? `${formatDate(item.startDate)} — ${formatDate(item.endDate)}`
        : undefined,
  };
}

  async function loadRequests() {
    setLoadState("loading");
    setLoadError("");

    try {
      const response = await fetch("/api/employee-experience", {
        method: "GET",
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ??
            (isArabic
              ? "تعذر تحميل الطلبات."
              : "Unable to load requests."),
        );
      }

      const mapped: EmployeeRequest[] = (payload.data ?? []).map(
        mapApiRequest,
      );

      setRequests(mapped);
      setSelectedRequestId((current) => current || mapped[0]?.id || "");
      setLoadState("loaded");
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : isArabic
            ? "تعذر تحميل الطلبات."
            : "Unable to load requests.",
      );
      setLoadState("error");
    }
  }

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copy = {
    pageEyebrow: isArabic ? "تجربة الموظف" : "EMPLOYEE EXPERIENCE",
    pageTitle: isArabic
      ? "مركز عمليات الموارد البشرية"
      : "HR Operations Center",
    pageDescription: isArabic
      ? "راجع طلبات الإجازة الفعلية الواردة من الموظفين عبر Employee Experience Agent."
      : "Review real leave requests submitted by employees through the Employee Experience Agent.",
    live: isArabic ? "النظام يعمل" : "System operational",
    manager: isArabic
      ? "مدير تجربة الموظف"
      : "Employee Experience Manager",
    managerDescription: isArabic
      ? "يستقبل طلبات إجازة الموظفين، ينشئها في النظام، ويحوّلها إلى فريق الموارد البشرية للموافقة."
      : "Receives employee leave requests, creates them in the system, and routes them to HR for approval.",
    requests: isArabic ? "طلبات الموظفين" : "Employee Requests",
    requestsDescription: isArabic
      ? "الطلبات التي تحتاج موافقة أو رفض من الموارد البشرية."
      : "Requests requiring HR approval or rejection.",
    searchPlaceholder: isArabic
      ? "ابحث برقم الموظف أو رقم الطلب..."
      : "Search employee ID or request ID...",
    all: isArabic ? "الكل" : "All",
    pending: isArabic ? "بانتظار المراجعة" : "Pending",
    approved: isArabic ? "تمت الموافقة" : "Approved",
    rejected: isArabic ? "مرفوض" : "Rejected",
    noRequests: isArabic ? "لا توجد طلبات مطابقة." : "No matching requests.",
    selectRequest: isArabic
      ? "اختر طلبًا لعرض التفاصيل"
      : "Select a request to view details",
    employee: isArabic ? "الموظف" : "Employee",
    employeeId: isArabic ? "اسم الموظف" : "Employee name",
    request: isArabic ? "الطلب" : "Request",
    requestedPeriod: isArabic ? "الفترة المطلوبة" : "Requested period",
    requestedAction: isArabic ? "الإجراء المطلوب" : "Requested Action",
    requestedActionText: isArabic
      ? "مراجعة طلب الموظف والموافقة عليه أو رفضه."
      : "Review the employee request and approve or reject it.",
    approve: isArabic ? "موافقة" : "Approve",
    reject: isArabic ? "رفض" : "Reject",
    decisionNote: isArabic
      ? "هذه الإجراءات مرتبطة مباشرة بقاعدة البيانات الحقيقية."
      : "These actions are wired directly to the real database.",
    loading: isArabic ? "جارِ تحميل الطلبات..." : "Loading requests...",
    loadErrorTitle: isArabic
      ? "تعذر تحميل الطلبات"
      : "Couldn't load requests",
    retry: isArabic ? "إعادة المحاولة" : "Retry",
    createdAt: isArabic ? "تاريخ الإنشاء" : "Created",
  };

  const selectedRequest =
    requests.find((request) => request.id === selectedRequestId) ??
    requests[0] ??
    null;

  const filteredRequests = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;

      if (!matchesStatus) return false;
      if (!normalizedSearch) return true;

      return [request.id, request.employeeId, request.description].some(
        (value) => value.toLowerCase().includes(normalizedSearch),
      );
    });
  }, [requests, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      pending: requests.filter((r) => r.status === "pending").length,
      approved: requests.filter((r) => r.status === "approved").length,
      rejected: requests.filter((r) => r.status === "rejected").length,
    };
  }, [requests]);

  async function handleDecision(
  requestId: string,
  decision: "approve" | "reject",
) {
  setActionState("working");

  const currentRequest = requests.find((r) => r.id === requestId);

  const basePath =
    currentRequest?.requestType === "employment_letter"
      ? "/api/employee-experience/letters"
      : "/api/employee-experience/requests";

  try {
    const response = await fetch(
      `${basePath}/${requestId}/${decision}`,
      { method: "POST" },
    );

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error ?? "Action failed.");
    }

    await loadRequests();
    setActionState("idle");
  } catch (error) {
    console.error(`Failed to ${decision} request:`, error);
    setActionState("error");
  }
}

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-[calc(100vh-76px)] bg-[var(--background)]"
    >
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--surface)] px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] text-[var(--text-muted)] shadow-[var(--shadow-small)]">
                <Sparkles size={14} className="text-[var(--brand-primary)]" />
                {copy.pageEyebrow}
              </span>

              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--success-background)] px-3 py-1.5 text-xs font-bold text-[var(--success)]">
                <span className="h-2 w-2 rounded-full bg-current" />
                {copy.live}
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-[-0.03em] text-[var(--text-primary)] sm:text-3xl lg:text-[34px]">
              {copy.pageTitle}
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] sm:text-[15px]">
              {copy.pageDescription}
            </p>
          </div>
        </header>

        {/* AI Manager + KPI */}
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(420px,1fr)]">
          <article className="relative overflow-hidden rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)] sm:p-6">
            <div className="pointer-events-none absolute -end-20 -top-24 h-56 w-56 rounded-full bg-[var(--brand-subtle)] opacity-70 blur-3xl" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-primary)] text-white shadow-[0_10px_30px_rgba(37,99,235,0.18)]">
                <Bot size={27} strokeWidth={1.9} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-black tracking-tight text-[var(--text-primary)] sm:text-xl">
                    {copy.manager}
                  </h2>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--success-background)] px-2.5 py-1 text-[11px] font-bold text-[var(--success)]">
                    <Activity size={12} />
                    {isArabic ? "يعمل بشكل طبيعي" : "Operational"}
                  </span>
                </div>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
                  {copy.managerDescription}
                </p>
              </div>
            </div>
          </article>

          <div className="grid grid-cols-3 gap-4">
            <KpiCard
              icon={<Inbox size={19} />}
              value={stats.pending.toString()}
              label={copy.pending}
              tone="warning"
            />
            <KpiCard
              icon={<CheckCircle2 size={19} />}
              value={stats.approved.toString()}
              label={copy.approved}
              tone="success"
            />
            <KpiCard
              icon={<CircleAlert size={19} />}
              value={stats.rejected.toString()}
              label={copy.rejected}
              tone="critical"
            />
          </div>
        </section>

        {/* Main workspace */}
        <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.38fr)]">
          {/* Requests list */}
          <article className="min-w-0 overflow-hidden rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
            <div className="border-b border-[var(--border-default)] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <MessageSquareText
                      size={19}
                      className="text-[var(--brand-primary)]"
                    />
                    <h2 className="text-base font-black text-[var(--text-primary)]">
                      {copy.requests}
                    </h2>
                  </div>
                  <p className="mt-1.5 text-xs leading-5 text-[var(--text-muted)]">
                    {copy.requestsDescription}
                  </p>
                </div>

                <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-[var(--surface-muted)] px-2 text-xs font-black text-[var(--text-primary)]">
                  {filteredRequests.length}
                </span>
              </div>

              <div className="mt-4">
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={copy.searchPlaceholder}
                  className={`h-11 w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:bg-[var(--surface)] ${
                    isArabic ? "pr-4 pl-4" : "pl-4 pr-4"
                  }`}
                />

                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  <FilterButton
                    active={statusFilter === "all"}
                    label={copy.all}
                    onClick={() => setStatusFilter("all")}
                  />
                  <FilterButton
                    active={statusFilter === "pending"}
                    label={copy.pending}
                    onClick={() => setStatusFilter("pending")}
                  />
                  <FilterButton
                    active={statusFilter === "approved"}
                    label={copy.approved}
                    onClick={() => setStatusFilter("approved")}
                  />
                  <FilterButton
                    active={statusFilter === "rejected"}
                    label={copy.rejected}
                    onClick={() => setStatusFilter("rejected")}
                  />
                </div>
              </div>
            </div>

            <div className="p-3">
              {loadState === "loading" ? (
                <div className="flex min-h-56 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
                  <Loader2
                    size={22}
                    className="animate-spin text-[var(--brand-primary)]"
                  />
                  <p className="text-sm font-bold text-[var(--text-muted)]">
                    {copy.loading}
                  </p>
                </div>
              ) : loadState === "error" ? (
                <div className="flex min-h-56 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
                  <CircleAlert size={22} className="text-[var(--critical)]" />
                  <p className="text-sm font-bold text-[var(--text-primary)]">
                    {copy.loadErrorTitle}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {loadError}
                  </p>
                  <button
                    type="button"
                    onClick={loadRequests}
                    className="mt-1 rounded-lg border border-[var(--border-default)] px-3 py-1.5 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--surface-muted)]"
                  >
                    {copy.retry}
                  </button>
                </div>
              ) : filteredRequests.length > 0 ? (
                <div className="space-y-2">
                  {filteredRequests.map((request) => (
                    <RequestListItem
                      key={request.id}
                      request={request}
                      selected={selectedRequest?.id === request.id}
                      locale={locale}
                      copy={copy}
                      onClick={() => setSelectedRequestId(request.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-56 flex-col items-center justify-center px-6 py-10 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--text-muted)]">
                    <Search size={20} />
                  </span>
                  <p className="mt-4 text-sm font-bold text-[var(--text-primary)]">
                    {copy.noRequests}
                  </p>
                </div>
              )}
            </div>
          </article>

          {/* Details */}
          {selectedRequest ? (
            <article className="min-w-0 overflow-hidden rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
              <div className="border-b border-[var(--border-default)] px-5 py-5 sm:px-6">
                <span className="text-xs font-extrabold text-[var(--brand-primary)]"
                title={selectedRequest.id}
                >
                  {formatShortReference(selectedRequest.id)}
                </span>

                <StatusBadge status={selectedRequest.status} locale={locale} />

                <h2 className="mt-2 text-xl font-black tracking-tight text-[var(--text-primary)]">
                  {selectedRequest.title}
                </h2>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {copy.createdAt}: {selectedRequest.createdAt}
                </p>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                <section>
                  <SectionHeading
                    icon={<UserRound size={17} />}
                    title={copy.employee}
                  />
                  <div className="mt-3 rounded-2xl border border-[var(--border-default)] bg-[var(--background)] p-4">
                    <p className="text-[10px] font-bold text-[var(--text-muted)]">
                      {copy.employeeId}
                    </p>
                    <p className="mt-0.5 font-extrabold text-[var(--text-primary)]">
                      {selectedRequest.employeeName}
                    </p>
                  </div>
                </section>

                <section>
                  <SectionHeading
                    icon={<CalendarDays size={17} />}
                    title={copy.request}
                  />
                  <div className="mt-3 rounded-2xl border border-[var(--border-default)] bg-[var(--background)] p-4">
                    <p className="text-sm leading-7 text-[var(--text-secondary)]">
                      {selectedRequest.description}
                    </p>

                    {selectedRequest.requestedDates ? (
                      <div className="mt-4 flex items-start gap-3 border-t border-[var(--border-default)] pt-4">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand-primary)]">
                          <CalendarDays size={17} />
                        </span>
                        <div>
                          <p className="text-[11px] font-bold text-[var(--text-muted)]">
                            {copy.requestedPeriod}
                          </p>
                          <p className="mt-0.5 text-sm font-extrabold text-[var(--text-primary)]">
                            {selectedRequest.requestedDates}
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </section>

                <section>
                  <SectionHeading
                    icon={<Activity size={17} />}
                    title={copy.requestedAction}
                  />
                  <div className="mt-3 rounded-2xl border border-[var(--border-default)] p-4">
                    <p className="text-sm leading-7 text-[var(--text-secondary)]">
                      {copy.requestedActionText}
                    </p>
                  </div>
                </section>

                <section className="border-t border-[var(--border-default)] pt-5">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => handleDecision(selectedRequest.id, "approve")}
                      disabled={
                        selectedRequest.status === "approved" ||
                        actionState === "working"
                      }
                      className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-4 text-sm font-extrabold text-white transition hover:bg-[var(--brand-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Check size={17} strokeWidth={2.4} />
                      {copy.approve}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDecision(selectedRequest.id, "reject")}
                      disabled={
                        selectedRequest.status === "rejected" ||
                        actionState === "working"
                      }
                      className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-[var(--surface)] px-4 text-sm font-extrabold text-[var(--critical)] transition hover:bg-[var(--critical-background)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <X size={17} strokeWidth={2.4} />
                      {copy.reject}
                    </button>
                  </div>

                  <p className="mt-3 text-center text-[11px] leading-5 text-[var(--text-muted)]">
                    {copy.decisionNote}
                  </p>
                </section>
              </div>
            </article>
          ) : (
            <article className="flex min-h-[500px] items-center justify-center rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-small)]">
              <div>
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--text-muted)]">
                  <Inbox size={23} />
                </span>
                <p className="mt-4 font-bold text-[var(--text-primary)]">
                  {copy.selectRequest}
                </p>
              </div>
            </article>
          )}
        </section>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Components                                   */
/* -------------------------------------------------------------------------- */

function KpiCard({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  tone: "brand" | "success" | "warning" | "critical";
}) {
  const toneClasses = {
    brand: "bg-[var(--brand-subtle)] text-[var(--brand-primary)]",
    success: "bg-[var(--success-background)] text-[var(--success)]",
    warning: "bg-[var(--warning-background)] text-[var(--warning)]",
    critical: "bg-[var(--critical-background)] text-[var(--critical)]",
  };

  return (
    <article className="flex min-h-[118px] min-w-0 flex-col justify-between rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] p-4 shadow-[var(--shadow-small)]">
      <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${toneClasses[tone]}`}>
        {icon}
      </span>
      <div className="mt-3 min-w-0">
        <p className="text-2xl font-black tracking-[-0.04em] text-[var(--text-primary)]">
          {value}
        </p>
        <p className="mt-0.5 truncate text-[11px] font-bold text-[var(--text-muted)] sm:text-xs">
          {label}
        </p>
      </div>
    </article>
  );
}

function FilterButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-lg px-3 py-2 text-xs font-extrabold transition ${
        active
          ? "border-2 border-[var(--text-primary)] bg-[var(--surface-muted)] text-[var(--text-primary)]"
          : "border-2 border-transparent bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      }`}
    >
      {label}
    </button>
  );
}

function RequestListItem({
  request,
  selected,
  locale,
  copy,
  onClick,
}: {
  request: EmployeeRequest;
  selected: boolean;
  locale: "ar" | "en";
  copy: { createdAt: string };
  onClick: () => void;
}) {

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group block w-full rounded-2xl border p-4 text-start transition ${
        selected
          ? "border-blue-200 bg-[var(--brand-subtle)]"
          : "border-transparent bg-transparent hover:border-[var(--border-default)] hover:bg-[var(--background)]"
      }`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
            selected
              ? "bg-[var(--brand-primary)] text-white"
              : "bg-[var(--surface-muted)] text-[var(--text-secondary)]"
          }`}
        >
          <CalendarDays size={16} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-[var(--text-primary)]">
                {request.employeeName}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-[var(--text-muted)]">
                {request.id} . {formatShortReference(request.id)}
              </p>
            </div>

            <ChevronRight
              size={16}
              className={`mt-1 shrink-0 text-[var(--text-muted)] transition ${
                locale === "ar" ? "rotate-180" : ""
              } ${selected ? "text-[var(--brand-primary)]" : "opacity-50"}`}
            />
          </div>

          <p className="mt-3 line-clamp-1 text-sm font-bold text-[var(--text-primary)]">
            {request.title}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={request.status} locale={locale} />
            <span className="text-[10px] text-[var(--text-muted)]">
              {request.createdAt}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function SectionHeading({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 text-[var(--text-primary)]">
      <span className="text-[var(--brand-primary)]">{icon}</span>
      <h3 className="text-sm font-black">{title}</h3>
    </div>
  );
}

function StatusBadge({
  status,
  locale,
}: {
  status: RequestStatus;
  locale: "ar" | "en";
}) {
  const labels: Record<RequestStatus, string> = {
    pending: locale === "ar" ? "بانتظار المراجعة" : "Pending",
    approved: locale === "ar" ? "تمت الموافقة" : "Approved",
    rejected: locale === "ar" ? "مرفوض" : "Rejected",
    cancelled: locale === "ar" ? "ملغى" : "Cancelled",
  };

  const classes: Record<RequestStatus, string> = {
    pending: "bg-[var(--warning-background)] text-[var(--warning)]",
    approved: "bg-[var(--success-background)] text-[var(--success)]",
    rejected: "bg-[var(--critical-background)] text-[var(--critical)]",
    cancelled: "bg-[var(--surface-muted)] text-[var(--text-muted)]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold ${classes[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[status]}
    </span>
  );
}