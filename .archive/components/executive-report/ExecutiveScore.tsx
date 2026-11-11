type ExecutiveScoreProps = {
  score?: number;
  status?: string;
  maturityLevel?: string;
  summary?: string;
};

export default function ExecutiveScore({
  score = 82,
  status = "Operational Readiness",
  maturityLevel = "Excellent",
  summary = "الشركة تظهر جاهزية تنفيذية قوية للتحول الذكي، مع فرص واضحة لتحسين سرعة القرار، أتمتة العمليات، وربط بيانات الموارد البشرية بالأداء التجاري.",
}: ExecutiveScoreProps) {
  const normalizedScore = Math.min(Math.max(score, 0), 100);

  return (
    <section className="mt-12 overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
      <div className="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white md:p-10">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute -bottom-28 left-10 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />

          <div className="relative">
            <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
              Executive Decision Summary
            </span>

            <h2 className="mt-7 max-w-4xl text-3xl font-black leading-tight md:text-5xl">
              Ready for Executive Action
            </h2>

            <p className="mt-6 max-w-4xl text-lg leading-9 text-slate-300">
              {summary}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  Current Status
                </p>
                <p className="mt-3 text-lg font-black text-white">{status}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  Maturity Level
                </p>
                <p className="mt-3 text-lg font-black text-emerald-300">
                  {maturityLevel}
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="flex flex-col justify-between bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-8 md:p-10">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-700">
              Executive Score
            </p>

            <div className="mt-6 flex items-end gap-2">
              <span className="text-7xl font-black leading-none text-slate-950 md:text-8xl">
                {normalizedScore}
              </span>
              <span className="mb-3 text-xl font-black text-slate-500">
                /100
              </span>
            </div>

            <p className="mt-5 text-base font-bold leading-7 text-slate-600">
              A consolidated readiness signal based on the current executive
              discovery inputs.
            </p>
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              <span>Readiness</span>
              <span>{normalizedScore}%</span>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                style={{ width: `${normalizedScore}%` }}
              />
            </div>

            <div className="mt-5 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">
                Board Signal
              </p>
              <p className="mt-3 text-sm font-bold leading-7 text-slate-700">
                The organization is ready to move from assessment into focused
                execution priorities.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}