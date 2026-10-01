type RiskItem = {
  title: string;
  level: "Low" | "Medium" | "High" | string;
  impact: number;
};

type ExecutiveRiskHeatmapProps = {
  title?: string;
  subtitle?: string;
  items: RiskItem[];
};

export default function ExecutiveRiskHeatmap({
  title = "Executive Risk Heatmap",
  subtitle = "قراءة مختصرة للمخاطر حسب مستوى الخطورة والأثر التنفيذي.",
  items,
}: ExecutiveRiskHeatmapProps) {
  const risks = items.slice(0, 6);

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-rose-600">
        Risk View
      </p>

      <h3 className="mt-2 text-2xl font-black text-slate-950">{title}</h3>

      <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
        {subtitle}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {risks.map((risk) => (
          <div
            key={risk.title}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700">
                {risk.level}
              </span>

              <span className="text-2xl font-black text-slate-950">
                {risk.impact}%
              </span>
            </div>

            <h4 className="mt-5 text-base font-black text-slate-950">
              {risk.title}
            </h4>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-slate-950"
                style={{
                  width: `${Math.min(Math.max(risk.impact, 0), 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}