import Link from "next/link";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_42%)]" />

      <div className="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-[1.08fr_0.92fr] lg:px-10">
        <div className="max-w-3xl">
          <div className="mb-7 inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200">
            Enterprise Intelligence &amp; Execution Platform
          </div>

          <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            حوّل معرفة مؤسستك إلى قرارات وتنفيذ
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            KAFU AI يمنح القيادة رؤية موحدة للمنظمة، ويحوّل البيانات
            والتحديات والأولويات إلى توصيات واضحة، مسؤوليات محددة،
            ومتابعة تنفيذية مستمرة.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/welcome"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-100"
            >
              ابدأ تجربة KAFU AI
            </Link>

            <Link
              href="/executive-summary"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition hover:border-cyan-300/50 hover:bg-white/10"
            >
              استعرض التجربة التنفيذية
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-400">
            <span>فهم مؤسسي أعمق</span>
            <span>قرارات أسرع</span>
            <span>تنفيذ أكثر وضوحًا</span>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-cyan-950/40 backdrop-blur">
            <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-sm text-slate-400">Executive Overview</p>
                  <h2 className="mt-1 text-xl font-semibold">
                    Organizational Intelligence
                  </h2>
                </div>

                <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  Live
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <MetricCard label="Readiness" value="87%" />
                <MetricCard label="Priority Actions" value="12" />
                <MetricCard label="Active Decisions" value="8" />
                <MetricCard label="Execution Health" value="92%" />
              </div>

              <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.07] p-5">
                <p className="text-sm font-medium text-cyan-200">
                  AI Executive Recommendation
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Prioritize workforce capability planning and connect
                  transformation initiatives to accountable owners and measurable
                  outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
}

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
