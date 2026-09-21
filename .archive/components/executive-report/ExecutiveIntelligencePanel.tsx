import ExecutiveCard from "./ExecutiveCard";
import ExecutiveHeader from "./ExecutiveHeader";

type ReadinessMatrixItem = {
  area: string;
  score: number;
  status: string;
  description: string;
};

type ExecutiveIntelligencePanelProps = {
  aiConfidence: number;
  dataQualityScore: number;
  discoveryCompletion: number;
  readinessMatrix: ReadinessMatrixItem[];
};

function normalizeScore(score: number) {
  return Math.min(Math.max(score, 0), 100);
}

function getStatusLabel(score: number) {
  if (score >= 85) return "Enterprise Ready";
  if (score >= 70) return "Strong";
  if (score >= 50) return "Developing";
  return "Needs Attention";
}

function getTone(score: number) {
  if (score >= 85) {
    return {
      text: "text-emerald-700",
      darkText: "text-emerald-300",
      border: "border-emerald-200/80",
      bar: "bg-emerald-500",
      soft: "from-emerald-50 via-white to-white",
    };
  }

  if (score >= 70) {
    return {
      text: "text-sky-700",
      darkText: "text-sky-300",
      border: "border-sky-200/80",
      bar: "bg-sky-500",
      soft: "from-sky-50 via-white to-white",
    };
  }

  if (score >= 50) {
    return {
      text: "text-amber-700",
      darkText: "text-amber-300",
      border: "border-amber-200/80",
      bar: "bg-amber-500",
      soft: "from-amber-50 via-white to-white",
    };
  }

  return {
    text: "text-rose-700",
    darkText: "text-rose-300",
    border: "border-rose-200/80",
    bar: "bg-rose-500",
    soft: "from-rose-50 via-white to-white",
  };
}

export default function ExecutiveIntelligencePanel({
  aiConfidence,
  dataQualityScore,
  discoveryCompletion,
  readinessMatrix,
}: ExecutiveIntelligencePanelProps) {
  const intelligenceScore = normalizeScore(
    Math.round((aiConfidence + dataQualityScore + discoveryCompletion) / 3),
  );

  const intelligenceTone = getTone(intelligenceScore);

  const metrics = [
    {
      label: "AI Confidence",
      value: normalizeScore(aiConfidence),
      description: "ثقة KAFU AI في دقة القراءة التنفيذية.",
    },
    {
      label: "Data Quality",
      value: normalizeScore(dataQualityScore),
      description: "اكتمال وجودة البيانات المستخدمة في التحليل.",
    },
    {
      label: "Discovery Completion",
      value: normalizeScore(discoveryCompletion),
      description: "مدى اكتمال إجابات جلسة الاستكشاف.",
    },
  ];

  return (
    <ExecutiveCard className="overflow-hidden p-0">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_32%),linear-gradient(135deg,#020617_0%,#0f172a_55%,#1e293b_100%)] p-8 text-white lg:p-10">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <ExecutiveHeader
            eyebrow="Executive Intelligence Center"
            title="مركز الذكاء التنفيذي"
            description="قراءة موحدة تجمع ثقة الذكاء الاصطناعي، جودة البيانات، اكتمال Discovery، وجاهزية طبقات KAFU AI."
            light
            className="mb-0"
          />

          <div className="shrink-0 rounded-[2rem] border border-white/10 bg-white/10 px-8 py-6 text-center shadow-2xl backdrop-blur">
            <p className="text-[11px] font-black uppercase tracking-[0.32em] text-slate-300">
              Intelligence Score
            </p>

            <p className="mt-4 text-6xl font-black leading-none text-white">
              {intelligenceScore}%
            </p>

            <p className={`mt-3 text-sm font-black ${intelligenceTone.darkText}`}>
              {getStatusLabel(intelligenceScore)}
            </p>
          </div>
        </div>
      </section>

      <section className="p-7 lg:p-9">
        <div className="grid gap-5 md:grid-cols-3">
          {metrics.map((metric) => {
            const tone = getTone(metric.value);

            return (
              <article
                key={metric.label}
                className={`rounded-[1.75rem] border ${tone.border} bg-gradient-to-br ${tone.soft} p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
              >
                <p
                  className={`text-[11px] font-black uppercase tracking-[0.26em] ${tone.text}`}
                >
                  {metric.label}
                </p>

                <div className="mt-5 flex items-end gap-2">
                  <span className="text-5xl font-black leading-none text-slate-950">
                    {metric.value}
                  </span>
                  <span className="mb-1 text-xl font-black text-slate-500">
                    %
                  </span>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white">
                  <div
                    className={`h-full rounded-full ${tone.bar}`}
                    style={{ width: `${metric.value}%` }}
                  />
                </div>

                <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
                  {metric.description}
                </p>
              </article>
            );
          })}
        </div>

        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.32em] text-slate-500">
                Readiness Matrix
              </p>

              <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
                جاهزية طبقات KAFU AI
              </h3>
            </div>

            <p className="max-w-xl text-sm font-medium leading-7 text-slate-600 md:text-base">
              هذه المصفوفة توضّح مدى جاهزية كل طبقة للانتقال من التحليل إلى التنفيذ.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {readinessMatrix.map((item) => {
              const score = normalizeScore(item.score);
              const tone = getTone(score);

              return (
                <article
                  key={item.area}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-black leading-7 text-slate-950">
                        {item.area}
                      </p>

                      <p className={`mt-2 text-sm font-black ${tone.text}`}>
                        {item.status || getStatusLabel(score)}
                      </p>
                    </div>

                    <p className="text-3xl font-black text-slate-950">
                      {score}%
                    </p>
                  </div>

                  <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${tone.bar}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>

                  <p className="mt-5 text-sm font-medium leading-7 text-slate-600">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
          <p className="text-[11px] font-black uppercase tracking-[0.32em] text-emerald-300">
            Executive Insight
          </p>

          <p className="mt-4 text-xl font-black leading-9 md:text-2xl md:leading-10">
            كلما ارتفعت جودة البيانات واكتمل Discovery، زادت قدرة KAFU AI على إنتاج توصيات تنفيذية دقيقة وقابلة للتحويل إلى قرارات.
          </p>
        </section>
      </section>
    </ExecutiveCard>
  );
}