import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

import {
  StatusBadge,
  type ExecutiveStatus,
} from "./StatusBadge";

export type KpiTrendDirection =
  | "up"
  | "down"
  | "neutral";

export interface KpiCardProps
  extends HTMLAttributes<HTMLElement> {
  title: string;
  value: string;
  trendValue?: string;
  trendDirection?: KpiTrendDirection;
  comparison?: string;
  status?: ExecutiveStatus;
  statusLabel?: string;
  icon?: ReactNode;
  footer?: ReactNode;
}

const trendConfiguration: Record<
  KpiTrendDirection,
  {
    className: string;
    icon: typeof ArrowUpRight;
  }
> = {
  up: {
    className: "text-green-700",
    icon: ArrowUpRight,
  },
  down: {
    className: "text-red-700",
    icon: ArrowDownRight,
  },
  neutral: {
    className: "text-slate-600",
    icon: ArrowRight,
  },
};

export function KpiCard({
  title,
  value,
  trendValue,
  trendDirection = "neutral",
  comparison,
  status,
  statusLabel,
  icon,
  footer,
  className = "",
  ...articleProps
}: KpiCardProps) {
  const trend = trendConfiguration[trendDirection];
  const TrendIcon = trend.icon;

  return (
    <article
      className={[
        "rounded-2xl border border-slate-200 bg-white p-5",
        "shadow-[0_1px_2px_rgba(15,23,42,0.06)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...articleProps}
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-600">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            {icon}
          </div>
        )}
      </header>

      {(trendValue || comparison) && (
        <div className="mt-4">
          {trendValue && (
            <div
              className={[
                "inline-flex items-center gap-1 text-sm font-semibold",
                trend.className,
              ].join(" ")}
            >
              <TrendIcon
                aria-hidden="true"
                className="h-4 w-4"
              />

              <span>{trendValue}</span>
            </div>
          )}

          {comparison && (
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {comparison}
            </p>
          )}
        </div>
      )}

      {(status || footer) && (
        <footer className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          {status ? (
            <StatusBadge
              status={status}
              label={statusLabel}
            />
          ) : (
            <span />
          )}

          {footer}
        </footer>
      )}
    </article>
  );
}
