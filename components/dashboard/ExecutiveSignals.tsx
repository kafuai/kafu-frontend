import type { ExecutiveSignal } from "@/lib/executive-intelligence";

type ExecutiveSignalsProps = {
  signals: ExecutiveSignal[];
};

const levelStyles = {
  positive: "bg-emerald-50 text-emerald-950",
  warning: "bg-amber-50 text-amber-950",
  critical: "bg-red-50 text-red-950",
  neutral: "bg-slate-100 text-slate-800",
};

const levelIcons = {
  positive: "✅",
  warning: "⚠️",
  critical: "🚨",
  neutral: "ℹ️",
};

export default function ExecutiveSignals({ signals }: ExecutiveSignalsProps) {
  return (
    <div className="rounded-3xl border border-slate-700 bg-white p-8 text-slate-900 shadow-xl">
      <h2 className="text-3xl font-bold">Executive Signals</h2>

      <div className="mt-6 space-y-4">
        {signals.map((signal) => (
          <div
            key={signal.title}
            className={`rounded-2xl p-4 leading-8 ${levelStyles[signal.level]}`}
          >
            <p className="font-black">
              {levelIcons[signal.level]} {signal.title}
            </p>
            <p className="mt-1 text-sm font-semibold opacity-80">
              {signal.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}