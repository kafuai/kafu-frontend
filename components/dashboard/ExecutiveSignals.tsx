import {
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
  Info,
  RadioTower,
} from "lucide-react";

import type { ExecutiveSignal } from "@/lib/executive-intelligence";

type ExecutiveSignalsProps = {
  signals: ExecutiveSignal[];
};

const signalStyles = {
  positive: {
    container: "border-emerald-200 bg-emerald-50",
    icon: "bg-white text-emerald-700",
    title: "text-emerald-950",
    description: "text-emerald-800",
    Icon: CheckCircle2,
  },
  warning: {
    container: "border-amber-200 bg-amber-50",
    icon: "bg-white text-amber-700",
    title: "text-amber-950",
    description: "text-amber-800",
    Icon: AlertTriangle,
  },
  critical: {
    container: "border-red-200 bg-red-50",
    icon: "bg-white text-red-700",
    title: "text-red-950",
    description: "text-red-800",
    Icon: CircleAlert,
  },
  neutral: {
    container: "border-slate-200 bg-slate-50",
    icon: "bg-white text-slate-600",
    title: "text-slate-950",
    description: "text-slate-600",
    Icon: Info,
  },
};

export default function ExecutiveSignals({
  signals,
}: ExecutiveSignalsProps) {
  return (
    <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
          <RadioTower size={18} />
        </span>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-primary)]">
            Executive Signals
          </p>

          <h2 className="mt-1 text-xl font-bold text-[var(--text-primary)]">
            الإشارات التنفيذية
          </h2>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {signals.map((signal) => {
          const style = signalStyles[signal.level];
          const Icon = style.Icon;

          return (
            <article
              key={signal.title}
              className={`rounded-xl border p-4 ${style.container}`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style.icon}`}
                >
                  <Icon size={17} />
                </span>

                <div className="min-w-0">
                  <h3 className={`text-sm font-bold leading-6 ${style.title}`}>
                    {signal.title}
                  </h3>

                  <p
                    className={`mt-1 text-xs leading-6 ${style.description}`}
                  >
                    {signal.description}
                  </p>
                </div>
              </div>
            </article>
          );
        })}

        {signals.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-600">
              لا توجد إشارات تنفيذية جديدة حاليًا.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
