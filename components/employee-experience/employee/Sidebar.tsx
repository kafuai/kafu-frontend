import { ArrowUp, CalendarDays, Sparkles, UsersRound } from "lucide-react";
import { HRRequest, RequestCategory } from "./types";
import { useAppCopy } from "./useAppCopy";
import { CategoryIcon, RequestCardSkeleton, StatusIcon } from "./SharedUI";

export default function Sidebar({
  isArabic,
  requests,
  initialLoading,
  selectedCategory,
  setSelectedCategory,
  setInput,
}: {
  isArabic: boolean;
  requests: HRRequest[];
  initialLoading: boolean;
  selectedCategory: RequestCategory | "all";
  setSelectedCategory: (cat: RequestCategory | "all") => void;
  setInput: (val: string) => void;
}) {
  const { copy, categoryLabels } = useAppCopy(isArabic);

  const visibleRequests =
    selectedCategory === "all"
      ? requests
      : requests.filter((r) => r.category === selectedCategory);

  function formatRequestDate(timestamp: number) {
    return new Intl.DateTimeFormat(isArabic ? "ar-SA" : "en-US", {
      day: "2-digit",
      month: "short",
    }).format(new Date(timestamp));
  }

  function formatShortReference(id: string): string {
    return `REQ-${id.replace(/-/g, "").slice(-6).toUpperCase()}`;
  }

  function formatDecisionDate(timestamp: number) {
    return new Intl.DateTimeFormat(isArabic ? "ar-SA" : "en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));
  }

  function statusBadgeClasses(status: string) {
    if (status === "approved") return "bg-emerald-50 text-emerald-600";
    if (status === "rejected") return "bg-red-50 text-red-600";
    return "bg-amber-50 text-amber-600";
  }

  function statusLabel(status: string) {
    if (status === "approved") return copy.statusApproved;
    if (status === "rejected") return copy.statusRejected;
    return copy.statusPending;
  }

  return (
    <aside className="flex flex-col gap-5">
      {/* Capabilities */}
      <div className="rounded-[26px] border border-[var(--border)] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">{copy.capabilitiesTitle}</p>
            <p className="mt-1 text-[11px] text-slate-400">{copy.capabilitiesSubtitle}</p>
          </div>
          <Sparkles size={17} className="text-[var(--brand-primary)]" />
        </div>

        <div className="space-y-2">
          {copy.capabilities.map((item) => (
            <button
              key={item.category}
              type="button"
              onClick={() => setInput(item.prompt)}
              className="group flex w-full items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-start transition hover:border-slate-100 hover:bg-slate-50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-[var(--brand-primary)] transition group-hover:bg-white">
                <CategoryIcon category={item.category} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-700">{item.title}</p>
                <p className="mt-0.5 truncate text-[10px] text-slate-400">{item.description}</p>
              </div>
              <ArrowUp
                size={14}
                className={`text-slate-300 transition group-hover:text-[var(--brand-primary)] ${
                  isArabic ? "rotate-[-45deg]" : "rotate-45"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* HR Requests */}
      <div className="flex-1 rounded-[26px] border border-[var(--border)] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-800">{copy.myRequestsTitle}</p>
            <p className="mt-1 text-[11px] text-slate-400">{copy.myRequestsSubtitle}</p>
          </div>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500">
            {requests.length}
          </span>
        </div>

        <div className="mb-3 flex items-center gap-1">
          {[
            { value: "all" as const, label: copy.filterAll },
            { value: "leave" as const, label: copy.filterLeave },
            { value: "employment_letter" as const, label: copy.filterLetters },
          ].map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setSelectedCategory(filter.value)}
              className={`rounded-lg px-2.5 py-1.5 text-[10px] font-medium transition ${
                selectedCategory === filter.value
                  ? "bg-slate-100 text-slate-700"
                  : "text-slate-400 hover:bg-slate-50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="space-y-2.5" aria-busy={initialLoading}>
          {initialLoading ? (
            <>
              <RequestCardSkeleton />
              <RequestCardSkeleton />
              <RequestCardSkeleton />
            </>
          ) : (
            <div className="space-y-2.5">
              {visibleRequests.slice(0, 4).map((request) => (
                <div key={request.id} className="rounded-2xl border border-slate-100 p-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-[var(--brand-primary)]">
                      <CategoryIcon category={request.category} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-slate-700">
                        {categoryLabels[request.category]}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        {formatShortReference(request.id)} · {formatRequestDate(request.createdAt)}
                      </p>
                      {request.category === "leave" && request.leaveType && (
                        <span className="mt-1.5 me-1.5 inline-flex items-center rounded-md bg-[var(--brand-subtle)] px-2 py-1 text-[10px] font-semibold text-[var(--brand-primary)]">
                          {copy.leaveTypeLabels[request.leaveType] ?? request.leaveType}
                        </span>
                      )}
                      {request.category === "leave" && request.startDate && request.endDate && (
                        <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-md bg-slate-100/70 px-2 py-1 text-[10px] font-medium text-slate-600">
                          <CalendarDays size={10} className="text-slate-400" />
                          <span>{formatRequestDate(request.startDate)}</span>
                          <span className="text-slate-300">➔</span>
                          <span>{formatRequestDate(request.endDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {request.status == "pending" && (
                    <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-2.5">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-medium ${statusBadgeClasses(request.status)}`}>
                        <StatusIcon status={request.status as any} />
                        {statusLabel(request.status)}
                      </span>
                    </div>
                  )}

                  {request.status !== "pending" && (
                    <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <div className="flex items-start gap-2.5">
                        <span className={request.status === "approved" ? "text-emerald-600" : "text-rose-600"}>
                          <StatusIcon status={request.status as any} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold text-slate-500">
                            {request.status === "approved" ? copy.statusApproved : copy.statusRejected}
                          </p>
                          <p className="mt-1 text-[11px] font-semibold text-slate-700">
                            {copy.decisionBy}: {request.reviewedByName ?? "—"}
                          </p>
                          {request.reviewedAt ? (
                            <p className="mt-0.5 text-[10px] text-slate-400">
                              {copy.decisionDate}: {formatDecisionDate(request.reviewedAt)}
                            </p>
                          ) : (
                            <p className="mt-0.5 text-[10px] text-slate-400">{copy.decisionPending}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {visibleRequests.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 px-4 py-8 text-center">
                  <UsersRound size={22} className="text-slate-300" />
                  <p className="mt-2 text-xs font-medium text-slate-500">{copy.noRequests}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}