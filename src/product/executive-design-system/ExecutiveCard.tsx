import type {
  HTMLAttributes,
  ReactNode,
} from "react";

export type ExecutiveCardTone =
  | "default"
  | "information"
  | "success"
  | "warning"
  | "critical";

export interface ExecutiveCardProps
  extends HTMLAttributes<HTMLElement> {
  title?: string;
  summary?: string;
  icon?: ReactNode;
  metric?: ReactNode;
  recommendation?: ReactNode;
  action?: ReactNode;
  eyebrow?: string;
  tone?: ExecutiveCardTone;
  elevated?: boolean;
  children?: ReactNode;
}

const toneClasses: Record<ExecutiveCardTone, string> = {
  default: "border-slate-200 bg-white",
  information: "border-blue-200 bg-blue-50/60",
  success: "border-green-200 bg-green-50/60",
  warning: "border-amber-200 bg-amber-50/60",
  critical: "border-red-200 bg-red-50/60",
};

export function ExecutiveCard({
  title,
  summary,
  icon,
  metric,
  recommendation,
  action,
  eyebrow,
  tone = "default",
  elevated = false,
  children,
  className = "",
  ...articleProps
}: ExecutiveCardProps) {
  return (
    <article
      className={[
        "rounded-2xl border p-6 transition-shadow duration-200",
        toneClasses[tone],
        elevated
          ? "shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
          : "shadow-[0_1px_2px_rgba(15,23,42,0.06)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...articleProps}
    >
      {(icon || eyebrow || title) && (
        <header className="flex items-start gap-4">
          {icon && (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              {icon}
            </div>
          )}

          <div className="min-w-0 flex-1">
            {eyebrow && (
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                {eyebrow}
              </p>
            )}

            {title && (
              <h3 className="text-xl font-semibold leading-7 text-slate-950">
                {title}
              </h3>
            )}
          </div>
        </header>
      )}

      {summary && (
        <p className="mt-4 text-base leading-7 text-slate-600">
          {summary}
        </p>
      )}

      {metric && <div className="mt-6">{metric}</div>}

      {children && <div className="mt-6">{children}</div>}

      {recommendation && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white/80 p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Recommendation
          </p>

          <div className="text-sm leading-6 text-slate-800">
            {recommendation}
          </div>
        </div>
      )}

      {action && (
        <footer className="mt-6 flex items-center justify-end">
          {action}
        </footer>
      )}
    </article>
  );
}
