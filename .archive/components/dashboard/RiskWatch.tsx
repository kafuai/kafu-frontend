import {
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

type RiskWatchProps = {
  risks: string[];
};

export default function RiskWatch({ risks }: RiskWatchProps) {
  return (
    <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
          <ShieldAlert size={18} />
        </span>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700">
            Risk Watch
          </p>

          <h2 className="mt-1 text-xl font-bold text-[var(--text-primary)]">
            مراقبة المخاطر
          </h2>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {risks.map((item) => (
          <article
            key={item}
            className="rounded-xl border border-amber-200 bg-amber-50 p-4"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0 text-amber-700"
              />

              <p className="text-sm font-semibold leading-7 text-amber-950">
                {item}
              </p>
            </div>
          </article>
        ))}

        {risks.length === 0 && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={18}
                className="mt-0.5 shrink-0 text-emerald-700"
              />

              <p className="text-sm font-semibold leading-7 text-emerald-950">
                لا توجد مخاطر حرجة مكتشفة حاليًا.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
