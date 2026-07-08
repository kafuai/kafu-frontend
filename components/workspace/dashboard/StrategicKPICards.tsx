export default function StrategicKPICards() {
  const kpis = [
    {
      title: "Readiness Score",
      value: "88%",
      subtitle: "جاهزية المنتج للعرض التنفيذي",
      trend: "+6%",
    },
    {
      title: "Demo Completeness",
      value: "92%",
      subtitle: "اكتمال بيانات وتجربة الديمو",
      trend: "+11%",
    },
    {
      title: "Decision Speed",
      value: "74%",
      subtitle: "سرعة الوصول إلى قرار تنفيذي",
      trend: "+9%",
    },
    {
      title: "Risk Visibility",
      value: "81%",
      subtitle: "وضوح المخاطر قبل التنفيذ",
      trend: "+5%",
    },
  ];

  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.title}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm font-bold text-slate-500">{kpi.title}</p>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
              {kpi.trend}
            </span>
          </div>

          <h3 className="mt-5 text-5xl font-black tracking-tight text-slate-950">
            {kpi.value}
          </h3>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            {kpi.subtitle}
          </p>
        </div>
      ))}
    </section>
  );
}
