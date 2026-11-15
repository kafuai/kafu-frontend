import { CalendarDays, ChevronRight } from "lucide-react";
import { EmployeeRequest, RequestStatus, formatShortReference } from "./types";

export function KpiCard({
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
        <p className="text-2xl font-black tracking-[-0.04em] text-[var(--text-primary)]">{value}</p>
        <p className="mt-0.5 truncate text-[11px] font-bold text-[var(--text-muted)] sm:text-xs">
          {label}
        </p>
      </div>
    </article>
  );
}

export function FilterButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
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

export function StatusBadge({ status, locale }: { status: RequestStatus; locale: "ar" | "en" }) {
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
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold ${classes[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[status]}
    </span>
  );
}

export function RequestListItem({ request, selected, locale, onClick }: { request: EmployeeRequest; selected: boolean; locale: "ar" | "en"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group block w-full rounded-2xl border p-4 text-start transition ${
        selected ? "border-blue-200 bg-[var(--brand-subtle)]" : "border-transparent bg-transparent hover:border-[var(--border-default)] hover:bg-[var(--background)]"
      }`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black ${selected ? "bg-[var(--brand-primary)] text-white" : "bg-[var(--surface-muted)] text-[var(--text-secondary)]"}`}>
          <CalendarDays size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-[var(--text-primary)]">{request.employeeName}</p>
              <p className="mt-0.5 truncate text-[11px] text-[var(--text-muted)]">{formatShortReference(request.id)}</p>
            </div>
            <ChevronRight size={16} className={`mt-1 shrink-0 text-[var(--text-muted)] transition ${locale === "ar" ? "rotate-180" : ""} ${selected ? "text-[var(--brand-primary)]" : "opacity-50"}`} />
          </div>
          <p className="mt-3 line-clamp-1 text-sm font-bold text-[var(--text-primary)]">{request.title}</p>
          {request.leaveTypeLabel && (
            <span className="mt-2 inline-flex items-center rounded-md bg-[var(--brand-subtle)] px-2 py-1 text-[10px] font-extrabold text-[var(--brand-primary)]">
              {request.leaveTypeLabel}
            </span>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={request.status} locale={locale} />
            <span className="text-[10px] text-[var(--text-muted)]">{request.createdAt}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

export function SectionHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 text-[var(--text-primary)]">
      <span className="text-[var(--brand-primary)]">{icon}</span>
      <h3 className="text-sm font-black">{title}</h3>
    </div>
  );
}

export function BalanceStat({ label, value, critical = false }: { label: string; value: number; critical?: boolean }) {
  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-2 py-2.5 text-center">
      <p className={`text-base font-black ${critical ? "text-[var(--critical)]" : "text-[var(--text-primary)]"}`}>{value}</p>
      <p className="mt-0.5 text-[10px] font-bold text-[var(--text-muted)]">{label}</p>
    </div>
  );
}