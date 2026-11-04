type ExecutiveHeroProps = {
  companyName?: string | null;
};

export default function ExecutiveHero({ companyName }: ExecutiveHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-800/90 bg-slate-950 px-7 py-8 text-white shadow-[0_40px_120px_rgba(15,23,42,0.28)] sm:px-10 lg:px-12 lg:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_48%)]" />

      <div className="relative grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.34em] text-emerald-300">
            KAFU AI Executive Intelligence
          </p>

          <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight md:text-6xl">
            التقرير التنفيذي الذكي
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg md:leading-9">
            قراءة تنفيذية احترافية مبنية على جلسة Discovery، تحول بيانات
            المؤسسة إلى رؤى استراتيجية تساعد الإدارة العليا على اتخاذ قرارات
            أكثر سرعة ودقة.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {[
              "Executive Summary",
              "Corporate Intelligence",
              "Board Decision",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/10 px-5 py-2.5 text-xs font-black tracking-wide text-slate-200 backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-7 backdrop-blur-xl">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
            Organization
          </p>

          <h2 className="mt-4 text-3xl font-black leading-tight">
            {companyName || "المؤسسة"}
          </h2>

          <div className="mt-7 space-y-4 text-sm">
            <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
              <span className="text-slate-400">Report Status</span>
              <span className="font-black text-emerald-300">Validated</span>
            </div>

            <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
              <span className="text-slate-400">Classification</span>
              <span className="font-black text-white">Executive</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Next Stage</span>
              <span className="font-black text-emerald-300">
                Corporate DNA
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}