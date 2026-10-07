import ExecutiveCard from "./ExecutiveCard";
import ExecutiveHeader from "./ExecutiveHeader";

type CorporateBrain = {
  decisionStyle?: string | null;
  executionMode?: string | null;
  riskPosture?: string | null;
  thinkingPatterns?: string[] | null;
  blindSpots?: string[] | null;
  leadershipSignals?: string[] | null;
  executiveSummary?: string | null;
  recommendedLeadershipFocus?: string | null;
};

type CorporateBrainCardProps = {
  brain?: CorporateBrain | null;
};

export default function CorporateBrainCard({
  brain,
}: CorporateBrainCardProps) {
  if (!brain) return null;

  return (
    <ExecutiveCard className="overflow-hidden p-0">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white lg:p-10">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-400/10 blur-3xl" />

        <div className="relative z-10">
          <ExecutiveHeader
            eyebrow="Corporate Brain"
            title="العقل التشغيلي للمؤسسة"
            description="تحليل لطريقة تفكير المؤسسة في اتخاذ القرار، وإدارة الأولويات، والتعامل مع المخاطر."
            light
            className="mb-0"
          />

          <section className="mt-8 grid gap-5 sm:grid-cols-3">
            <BrainMetric
              label="Decision Style"
              value={brain.decisionStyle}
              dark
            />

            <BrainMetric
              label="Execution Mode"
              value={brain.executionMode}
              dark
            />

            <BrainMetric
              label="Risk Posture"
              value={brain.riskPosture}
              dark
            />
          </section>
        </div>
      </section>

      <section className="p-7 lg:p-9">
        <section className="grid gap-6 lg:grid-cols-3">
          <BrainList
            title="Thinking Patterns"
            tone="sky"
            items={brain.thinkingPatterns}
          />

          <BrainList
            title="Blind Spots"
            tone="rose"
            items={brain.blindSpots}
          />

          <BrainList
            title="Leadership Signals"
            tone="emerald"
            items={brain.leadershipSignals}
          />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <BrainInsight
            eyebrow="Executive Brain Summary"
            title="ملخص العقل التشغيلي"
            body={
              brain.executiveSummary ||
              "No executive brain summary available yet."
            }
            featured
          />

          <BrainInsight
            eyebrow="Recommended Leadership Focus"
            title="تركيز القيادة المقترح"
            body={
              brain.recommendedLeadershipFocus ||
              "No leadership focus recommendation available yet."
            }
          />
        </section>
      </section>
    </ExecutiveCard>
  );
}

function BrainMetric({
  label,
  value,
  dark = false,
}: {
  label: string;
  value?: string | null;
  dark?: boolean;
}) {
  const safeValue = String(value ?? "Not Available").replaceAll("_", " ");

  return (
    <div
      className={
        dark
          ? "rounded-[1.75rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur"
          : "rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm"
      }
    >
      <p
        className={
          dark
            ? "text-[11px] font-black uppercase tracking-[0.28em] text-slate-300"
            : "text-[11px] font-black uppercase tracking-[0.28em] text-slate-500"
        }
      >
        {label}
      </p>

      <p
        className={
          dark
            ? "mt-4 text-2xl font-black tracking-tight text-white"
            : "mt-4 text-2xl font-black tracking-tight text-slate-950"
        }
      >
        {safeValue}
      </p>
    </div>
  );
}

function BrainList({
  title,
  items,
  tone,
}: {
  title: string;
  items?: string[] | null;
  tone: "emerald" | "rose" | "sky";
}) {
  const safeItems = Array.isArray(items) ? items : [];

  const toneStyles = {
    emerald: {
      badge: "text-emerald-700 bg-emerald-50 border-emerald-100",
      dot: "bg-emerald-500",
    },
    rose: {
      badge: "text-rose-700 bg-rose-50 border-rose-100",
      dot: "bg-rose-500",
    },
    sky: {
      badge: "text-sky-700 bg-sky-50 border-sky-100",
      dot: "bg-sky-500",
    },
  }[tone];

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <p
          className={`rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-[0.2em] ${toneStyles.badge}`}
        >
          {title}
        </p>

        <span className="text-sm font-black text-slate-400">
          {safeItems.length}
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {safeItems.length > 0 ? (
          safeItems.map((item) => (
            <div
              key={item}
              className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-700 transition-all duration-200 hover:border-slate-200 hover:bg-white"
            >
              <span
                className={`mt-2 h-2 w-2 shrink-0 rounded-full ${toneStyles.dot}`}
              />

              <span>{String(item ?? "").replaceAll("_", " ")}</span>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500">
            No data available yet.
          </div>
        )}
      </div>
    </div>
  );
}

function BrainInsight({
  eyebrow,
  title,
  body,
  featured = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  featured?: boolean;
}) {
  return (
    <section
      className={
        featured
          ? "rounded-[2rem] border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-white p-7"
          : "rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-7"
      }
    >
      <p
        className={
          featured
            ? "text-[11px] font-black uppercase tracking-[0.32em] text-sky-700"
            : "text-[11px] font-black uppercase tracking-[0.32em] text-slate-500"
        }
      >
        {eyebrow}
      </p>

      <h3 className="mt-4 text-2xl font-black leading-tight text-slate-950">
        {title}
      </h3>

      <p className="mt-5 text-base font-medium leading-8 text-slate-700">
        {body}
      </p>
    </section>
  );
}