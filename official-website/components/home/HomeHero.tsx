import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Network,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const outcomes = [
  "Unified organizational context",
  "Executive-ready intelligence",
  "Governed AI-assisted execution",
];

export default function HomeHero() {
  return (
    <section className="enterprise-grid hero-glow relative overflow-hidden bg-[#071321] pb-24 pt-[156px] text-white lg:min-h-[760px] lg:pb-28 lg:pt-[178px]">
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#071321] to-transparent" />

      <div className="website-shell relative z-10 grid items-center gap-16 lg:grid-cols-[1.08fr_0.92fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.07] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200">
            <Sparkles size={14} />
            Enterprise Intelligence Operating Environment
          </div>

          <h1 className="text-balance mt-7 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-[68px]">
            Turn organizational knowledge into
            <span className="block text-[#69d1d5]">executive clarity.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            KAFU AI connects institutional knowledge, decision intelligence and
            coordinated AI execution in one governed enterprise environment.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#071321] shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Book Executive Demo
              <ArrowRight size={17} />
            </Link>

            <Link
              href="#platform"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/10"
            >
              Explore the Platform
            </Link>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {outcomes.map((outcome) => (
              <div
                key={outcome}
                className="flex items-center gap-2 text-sm text-slate-300"
              >
                <CheckCircle2 size={16} className="shrink-0 text-[#69d1d5]" />
                {outcome}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-10 rounded-full bg-[#0c7d88]/15 blur-3xl" />

          <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-white/[0.07] p-3 shadow-2xl backdrop-blur-xl">
            <div className="rounded-[22px] border border-white/10 bg-[#0a1929]/95 p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                    Executive Intelligence
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    Organizational Command View
                  </p>
                </div>

                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  Ready
                </span>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  {
                    icon: BrainCircuit,
                    title: "Corporate Brain",
                    text: "Institutional knowledge and reasoning",
                  },
                  {
                    icon: Building2,
                    title: "Executive Context",
                    text: "Priorities, risks and business direction",
                  },
                  {
                    icon: Network,
                    title: "Coordinated Execution",
                    text: "Actions, ownership and digital workforce",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Enterprise Governance",
                    text: "Controlled, accountable AI adoption",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/10 bg-white/[0.055] p-4"
                    >
                      <Icon size={20} className="text-[#69d1d5]" />
                      <p className="mt-4 text-sm font-semibold">{item.title}</p>
                      <p className="mt-2 text-xs leading-5 text-slate-400">
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 rounded-2xl border border-[#69d1d5]/20 bg-[#69d1d5]/[0.08] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8ee1e4]">
                  Executive Priority
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-200">
                  Align organizational knowledge, leadership decisions and
                  execution around the highest-value transformation outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
