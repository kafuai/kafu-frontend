import { AlertTriangle, ShieldCheck } from "lucide-react";

type RiskWatchProps = {
  risks: string[];
};

export default function RiskWatch({ risks }: RiskWatchProps) {
  return (
    <section className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)] sm:p-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">
          Risk Watch
        </p>

        <h2 className="mt-1 text-2xl font-black text-[var(--text-primary)]">
          مراقبة المخاطر
        </h2>
      </div>

      <div className="mt-6 space-y-4">
        {risks.map((item) => (
          <article
            key={item}
            className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-amber-950"
          >
            <AlertTriangle
              size={19}
              className="mt-1 shrink-0 text-amber-700"
            />

            <p className="text-sm font-bold leading-7">
              {item}
            </p>
          </article>
        ))}

        {risks.length === 0 && (
          <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-950">
            <ShieldCheck
              size={19}
              className="mt-1 shrink-0 text-emerald-700"
            />

            <p className="text-sm font-bold leading-7">
              لا توجد مخاطر حرجة مكتشفة حاليًا.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}