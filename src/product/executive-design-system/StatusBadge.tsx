import type {
  HTMLAttributes,
  ReactNode,
} from "react";

export type ExecutiveStatus =
  | "healthy"
  | "good"
  | "attention"
  | "critical"
  | "in-progress"
  | "completed"
  | "pending";

export interface StatusBadgeProps
  extends HTMLAttributes<HTMLSpanElement> {
  status: ExecutiveStatus;
  label?: string;
  icon?: ReactNode;
  showIndicator?: boolean;
}

interface StatusConfiguration {
  defaultLabel: string;
  className: string;
  indicatorClassName: string;
}

const statusConfigurations: Record<
  ExecutiveStatus,
  StatusConfiguration
> = {
  healthy: {
    defaultLabel: "Healthy",
    className: "border-green-200 bg-green-50 text-green-700",
    indicatorClassName: "bg-green-600",
  },
  good: {
    defaultLabel: "Good",
    className: "border-blue-200 bg-blue-50 text-blue-700",
    indicatorClassName: "bg-blue-600",
  },
  attention: {
    defaultLabel: "Attention",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    indicatorClassName: "bg-amber-600",
  },
  critical: {
    defaultLabel: "Critical",
    className: "border-red-200 bg-red-50 text-red-700",
    indicatorClassName: "bg-red-600",
  },
  "in-progress": {
    defaultLabel: "In Progress",
    className: "border-violet-200 bg-violet-50 text-violet-700",
    indicatorClassName: "bg-violet-600",
  },
  completed: {
    defaultLabel: "Completed",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    indicatorClassName: "bg-emerald-600",
  },
  pending: {
    defaultLabel: "Pending",
    className: "border-slate-200 bg-slate-100 text-slate-700",
    indicatorClassName: "bg-slate-500",
  },
};

export function StatusBadge({
  status,
  label,
  icon,
  showIndicator = true,
  className = "",
  ...spanProps
}: StatusBadgeProps) {
  const configuration = statusConfigurations[status];

  return (
    <span
      className={[
        "inline-flex min-h-7 items-center gap-2 rounded-full border px-2.5 py-1",
        "text-xs font-semibold leading-none",
        configuration.className,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...spanProps}
    >
      {icon}

      {!icon && showIndicator && (
        <span
          aria-hidden="true"
          className={[
            "h-1.5 w-1.5 rounded-full",
            configuration.indicatorClassName,
          ].join(" ")}
        />
      )}

      <span>{label ?? configuration.defaultLabel}</span>
    </span>
  );
}
