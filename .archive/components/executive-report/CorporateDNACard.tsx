import { CorporateDNA } from "@/types/corporateDNA";
import ExecutiveCard from "./ExecutiveCard";
import ExecutiveHeader from "./ExecutiveHeader";

type CorporateDNACardProps = {
  dna: CorporateDNA | null;
};

export default function CorporateDNACard({ dna }: CorporateDNACardProps) {
  if (!dna) return null;

  return (
    <ExecutiveCard className="overflow-hidden p-0">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white lg:p-10">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="relative z-10">
          <ExecutiveHeader
            eyebrow="Corporate DNA"
            title="الهوية التشغيلية للمؤسسة"
            description="قراءة أولية لهوية المؤسسة كما يستنتجها KAFU AI اعتمادًا على البيانات التنفيذية الحالية."
            light
            className="mb-0"
          />

          <section className="mt-8 grid gap-5 sm:grid-cols-3">
            <DNAMetric label="Maturity" value={`${dna.maturityScore}%`} dark />
            <DNAMetric label="Stage" value={dna.businessStage} dark />
            <DNAMetric label="Pattern" value={dna.organizationPattern} dark />
          </section>
        </div>
      </section>

      <section className="p-7 lg:p-9">
        <section className="grid gap-6 lg:grid-cols-3">
          <DNAList
            title="Strengths"
            tone="emerald"
            items={dna.strengths.map((item) => item.title)}
          />

          <DNAList
            title="Risks"
            tone="rose"
            items={dna.risks.map((item) => item.title)}
          />

          <DNAList title="Priorities" tone="sky" items={dna.priorities} />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <DNAInsight
            eyebrow="Executive DNA Summary"
            title="القراءة التنفيذية للهوية التشغيلية"
            body={dna.executiveSummary}
            featured
          />

          <DNAInsight
            eyebrow="Recommended Path"
            title="المسار المقترح"
            body={dna.recommendedPath}
          />
        </section>
      </section>
    </ExecutiveCard>
  );
}

function DNAMetric({
  label,
  value,
  dark = false,
}: {
  label: string;
  value: string;
  dark?: boolean;
}) {
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
            ? "mt-4 text-3xl font-black tracking-tight text-white"
            : "mt-4 text-3xl font-black tracking-tight text-slate-950"
        }
      >
        {value}
      </p>
    </div>
  );
}

function DNAList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "emerald" | "rose" | "sky";
}) {
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
      <div className="flex items-center justify-between gap-4">
        <p
          className={`rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-[0.2em] ${toneStyles.badge}`}
        >
          {title}
        </p>

        <span className="text-sm font-black text-slate-400">
          {items.length}
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-700 transition-all duration-200 hover:border-slate-200 hover:bg-white"
          >
            <span
              className={`mt-2 h-2 w-2 shrink-0 rounded-full ${toneStyles.dot}`}
            />
            <span>{item.replaceAll("_", " ")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DNAInsight({
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
          ? "rounded-[2rem] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white p-7"
          : "rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-7"
      }
    >
      <p
        className={
          featured
            ? "text-[11px] font-black uppercase tracking-[0.32em] text-emerald-700"
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