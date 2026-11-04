import ExecutiveChartCard from "./ExecutiveChartCard";
import ExecutiveGrowthCurve from "./ExecutiveGrowthCurve";
import ExecutiveRadarChart from "./ExecutiveRadarChart";
import ExecutiveScoreRing from "./ExecutiveScoreRing";

type ReadinessMatrixItem = {
  area: string;
  score: number;
  status: string;
  description: string;
};

type ExecutiveIntelligenceDashboardProps = {
  overallScore: number;
  aiConfidence: number;
  dataQualityScore: number;
  discoveryCompletion: number;
  readinessMatrix: ReadinessMatrixItem[];
};

function normalizeScore(score: number) {
  return Math.min(Math.max(score, 0), 100);
}

export default function ExecutiveIntelligenceDashboard({
  overallScore,
  aiConfidence,
  dataQualityScore,
  discoveryCompletion,
  readinessMatrix,
}: ExecutiveIntelligenceDashboardProps) {
  const radarData = readinessMatrix.map((item) => ({
    label: item.area,
    score: normalizeScore(item.score),
  }));

  const growthData = [
    { label: "Discovery", value: normalizeScore(discoveryCompletion) },
    { label: "Data", value: normalizeScore(dataQualityScore) },
    { label: "AI", value: normalizeScore(aiConfidence) },
    { label: "Score", value: normalizeScore(overallScore) },
  ];

  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <ExecutiveChartCard
        title="Executive Readiness Radar"
        subtitle="A multi-dimensional view of readiness across the most important executive areas."
      >
        <div className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4">
          <ExecutiveRadarChart data={radarData} />
        </div>
      </ExecutiveChartCard>

      <ExecutiveChartCard
        title="Organization Score"
        subtitle="Central readiness signal generated from the current executive discovery and intelligence inputs."
      >
        <div className="flex min-h-[360px] items-center justify-center rounded-[1.75rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-6">
          <ExecutiveScoreRing
            score={normalizeScore(overallScore)}
            label="Overall Readiness"
          />
        </div>
      </ExecutiveChartCard>

      <ExecutiveChartCard
        title="Intelligence Growth Curve"
        subtitle="Compares discovery completion, data quality, AI confidence, and the overall executive score."
      >
        <div className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4">
          <ExecutiveGrowthCurve data={growthData} />
        </div>
      </ExecutiveChartCard>

      <ExecutiveChartCard
        title="Decision Signals"
        subtitle="Executive signals that help leadership identify where to focus first."
      >
        <div className="space-y-4">
          {readinessMatrix.map((item) => {
            const score = normalizeScore(item.score);

            return (
              <article
                key={item.area}
                className="group rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-base font-black text-slate-950">
                      {item.area}
                    </p>

                    <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
                      {item.description}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-2xl font-black text-slate-950">
                      {score}%
                    </p>

                    <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
                      {item.status}
                    </p>
                  </div>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </ExecutiveChartCard>
    </section>
  );
}