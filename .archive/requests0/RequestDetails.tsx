import { Activity, CalendarDays, Check, Inbox, UserRound, X } from "lucide-react";
import { EmployeeRequest, formatShortReference } from "./types";
import { BalanceStat, SectionHeading, StatusBadge } from "./SharedUI";

type RequestDetailsProps = {
  copy: any;
  locale: "ar" | "en";
  isArabic: boolean;
  selectedRequest: EmployeeRequest | null;
  handleDecision: (id: string, decision: "approve" | "reject") => void;
  actionState: "idle" | "working" | "error";
  openAttachment: (id: string) => void;
  attachmentError: string;
};

export default function RequestDetails({
  copy,
  locale,
  isArabic,
  selectedRequest,
  handleDecision,
  actionState,
  openAttachment,
  attachmentError,
}: RequestDetailsProps) {
  if (!selectedRequest) {
    return (
      <article className="flex min-h-[500px] items-center justify-center rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-small)]">
        <div>
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--text-muted)]">
            <Inbox size={23} />
          </span>
          <p className="mt-4 font-bold text-[var(--text-primary)]">{copy.selectRequest}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="min-w-0 overflow-hidden rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
      <div className="border-b border-[var(--border-default)] px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-extrabold text-[var(--brand-primary)]" title={selectedRequest.id}>
            {formatShortReference(selectedRequest.id)}
          </span>
          <StatusBadge status={selectedRequest.status} locale={locale} />
        </div>
        <h2 className="mt-2 text-xl font-black tracking-tight text-[var(--text-primary)]">{selectedRequest.title}</h2>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          {copy.createdAt}: {selectedRequest.createdAt}
        </p>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <section>
          <SectionHeading icon={<UserRound size={17} />} title={copy.employee} />
          <div className="mt-3 rounded-2xl border border-[var(--border-default)] bg-[var(--background)] p-4">
            <p className="text-[10px] font-bold text-[var(--text-muted)]">{copy.employeeId}</p>
            <p className="mt-0.5 font-extrabold text-[var(--text-primary)]">{selectedRequest.employeeName}</p>
          </div>
        </section>

        <section>
          <SectionHeading icon={<CalendarDays size={17} />} title={copy.request} />
          {selectedRequest.requestType === "leave" && (
            <div className="mt-3 rounded-2xl border border-[var(--border-default)] bg-[var(--background)] p-4">
              <p className="text-[11px] font-bold text-[var(--text-muted)]">{copy.leaveType}</p>
              {selectedRequest.leaveTypeLabel && (
                <p className="font-bold">{selectedRequest.leaveTypeLabel}</p>
              )}
            </div>
          )}

          <div className="mt-3 rounded-2xl border border-[var(--border-default)] bg-[var(--background)] p-4">
            <p className="text-sm leading-7 text-[var(--text-secondary)]">{selectedRequest.description}</p>

            {selectedRequest.requestedDates && (
              <div className="mt-4 flex items-start gap-3 border-t border-[var(--border-default)] pt-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand-primary)]">
                  <CalendarDays size={17} />
                </span>
                <div>
                  <p className="text-[11px] font-bold text-[var(--text-muted)]">{copy.requestedPeriod}</p>
                  <p className="mt-0.5 text-sm font-extrabold text-[var(--text-primary)]">{selectedRequest.requestedDates}</p>
                </div>
              </div>
            )}

            {selectedRequest.hasAttachment && (
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--border-default)] pt-4">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-[var(--text-muted)]">{copy.attachment}</p>
                  <p className="mt-0.5 truncate text-sm font-extrabold text-[var(--text-primary)]">
                    📎 {selectedRequest.attachmentName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openAttachment(selectedRequest.id)}
                  className="shrink-0 rounded-lg border border-[var(--border-default)] px-3 py-1.5 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--surface-muted)]"
                >
                  {copy.viewAttachment}
                </button>
              </div>
            )}
            {attachmentError && (
              <p role="alert" className="mt-2 text-xs font-bold text-[var(--critical)]">{attachmentError}</p>
            )}

            {selectedRequest.leaveBalance && (
              <div className="mt-4 border-t border-[var(--border-default)] pt-4">
                <p className="text-[11px] font-bold text-[var(--text-muted)]">
                  {isArabic ? `رصيد ${selectedRequest.leaveTypeLabel} للموظف` : `Employee ${selectedRequest.leaveTypeLabel} balance`}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
                  <BalanceStat label={copy.balanceAllowance} value={selectedRequest.leaveBalance.allowance} />
                  <BalanceStat label={copy.balanceUsed} value={selectedRequest.leaveBalance.approved} />
                  <BalanceStat label={copy.balancePending} value={selectedRequest.leaveBalance.pending} />
                  <BalanceStat label={copy.balanceRequested} value={selectedRequest.leaveBalance.requested} />
                  <BalanceStat label={copy.balanceAfter} value={selectedRequest.leaveBalance.remainingAfter} critical={selectedRequest.leaveBalance.remainingAfter < 0} />
                </div>
              </div>
            )}
          </div>
        </section>

        <section>
          <SectionHeading icon={<Activity size={17} />} title={copy.requestedAction} />
          <div className="mt-3 rounded-2xl border border-[var(--border-default)] p-4">
            <p className="text-sm leading-7 text-[var(--text-secondary)]">{copy.requestedActionText}</p>
          </div>
        </section>

        <section className="border-t border-[var(--border-default)] pt-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => handleDecision(selectedRequest.id, "approve")}
              disabled={selectedRequest.status === "approved" || actionState === "working"}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-4 text-sm font-extrabold text-white transition hover:bg-[var(--brand-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check size={17} strokeWidth={2.4} />
              {copy.approve}
            </button>
            <button
              type="button"
              onClick={() => handleDecision(selectedRequest.id, "reject")}
              disabled={selectedRequest.status === "rejected" || actionState === "working"}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-[var(--surface)] px-4 text-sm font-extrabold text-[var(--critical)] transition hover:bg-[var(--critical-background)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={17} strokeWidth={2.4} />
              {copy.reject}
            </button>
          </div>
          <p className="mt-3 text-center text-[11px] leading-5 text-[var(--text-muted)]">{copy.decisionNote}</p>
        </section>
      </div>
    </article>
  );
}