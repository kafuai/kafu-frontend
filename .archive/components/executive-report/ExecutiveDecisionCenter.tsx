import ExecutiveCard from "./ExecutiveCard";
import ExecutiveHeader from "./ExecutiveHeader";

type DecisionItem = {
  label: string;
  value: string;
  description: string;
  highlight?: boolean;
};

type ExecutiveDecisionCenterProps = {
  score: number;
  aiConfidence: number;
  dataQualityScore: number;
};

export default function ExecutiveDecisionCenter({
  score,
  aiConfidence,
  dataQualityScore,
}: ExecutiveDecisionCenterProps) {
  const items: DecisionItem[] = [
    {
      label: "First Priority",
      value: score >= 75 ? "Scale with Control" : "Stabilize Operations",
      description:
        score >= 75
          ? "تحويل النضج الحالي إلى نمو منظم دون فقدان جودة التنفيذ."
          : "تثبيت الأساس التشغيلي قبل التوسع.",
      highlight: true,
    },
    {
      label: "Biggest Risk",
      value: score >= 75 ? "Execution Drift" : "Operational Pressure",
      description:
        score >= 75
          ? "فقدان الاتساق أثناء النمو السريع."
          : "زيادة الضغط على الفريق والعمليات.",
    },
    {
      label: "AI Confidence",
      value: `${aiConfidence}%`,
      description: "درجة ثقة KAFU AI في التحليل الحالي.",
    },
    {
      label: "Data Quality",
      value: `${dataQualityScore}%`,
      description: "جودة البيانات التي بُنيت عليها التوصيات.",
    },
  ];

  return (
    <ExecutiveCard>
      <ExecutiveHeader
        eyebrow="Decision Center"
        title="مركز القرار التنفيذي"
        description="ملخص تنفيذي سريع لأهم الإشارات التي ينبغي أن يراجعها مجلس الإدارة قبل اعتماد الخطوات القادمة."
      />

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <article
            key={item.label}
            className={`group relative overflow-hidden rounded-[1.75rem] border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
              item.highlight
                ? "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white"
                : "border-slate-200 bg-white"
            }`}
          >
            {item.highlight && (
              <div className="absolute right-0 top-0 h-1.5 w-full bg-gradient-to-r from-emerald-500 to-emerald-300" />
            )}

            <p
              className={`text-[11px] font-black uppercase tracking-[0.24em] ${
                item.highlight ? "text-emerald-700" : "text-slate-400"
              }`}
            >
              {item.label}
            </p>

            <h3 className="mt-4 text-2xl font-black leading-tight text-slate-950">
              {item.value}
            </h3>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 overflow-hidden rounded-[2rem] border border-emerald-200 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800">
        <div className="p-8">
          <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
            Executive Recommendation
          </span>

          <p className="mt-6 text-lg font-bold leading-9 text-slate-200">
            {score >= 75
              ? "تشير المؤشرات إلى جاهزية المؤسسة للانتقال إلى مرحلة التوسع المنظم، مع ضرورة الحفاظ على الانضباط التشغيلي والحوكمة أثناء النمو."
              : "تشير المؤشرات إلى أن الأولوية الحالية يجب أن تركز على تعزيز الأساس التشغيلي، ورفع جودة البيانات، وتحسين كفاءة التنفيذ قبل التوسع."}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Metric
              label="Executive Score"
              value={`${score}%`}
            />

            <Metric
              label="AI Confidence"
              value={`${aiConfidence}%`}
            />

            <Metric
              label="Data Quality"
              value={`${dataQualityScore}%`}
            />
          </div>
        </div>
      </section>
    </ExecutiveCard>
  );
}

type MetricProps = {
  label: string;
  value: string;
};

function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black text-white">
        {value}
      </p>
    </div>
  );
}