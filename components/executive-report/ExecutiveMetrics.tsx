type Metric = {
  label: string;
  value: string;
  note: string;
};

type ExecutiveMetricsProps = {
  metrics: Metric[];
  className?: string;
};

export default function ExecutiveMetrics({
  metrics,
  className = "",
}: ExecutiveMetricsProps) {
  return (
    <section className={`grid gap-6 md:grid-cols-2 xl:grid-cols-4 ${className}`}>
      {metrics.map((metric, index) => (
        <article
          key={metric.label}
          className="
            group
            relative
            overflow-hidden
            rounded-[2.25rem]
            border
            border-slate-200/70
            bg-white/95
            p-7
            shadow-[0_20px_70px_rgba(15,23,42,0.07)]
            backdrop-blur-xl
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-slate-300/90
            hover:shadow-[0_32px_90px_rgba(15,23,42,0.12)]
            md:p-8
          "
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500" />

          <div className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-slate-100/80 blur-3xl transition-opacity duration-300 group-hover:opacity-90" />

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-[0.32em] text-slate-400">
                KPI {String(index + 1).padStart(2, "0")}
              </span>

              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.6)]" />
              </span>
            </div>

            <p className="mt-7 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              {metric.label}
            </p>

            <h2 className="mt-3 text-5xl font-black tracking-tight text-slate-950">
              {metric.value}
            </h2>

            <div className="my-6 h-px bg-gradient-to-r from-slate-100 via-slate-200 to-transparent" />

            <p className="text-sm leading-7 text-slate-600">
              {metric.note}
            </p>
          </div>
        </article>
      ))}
    </section>
  );
}