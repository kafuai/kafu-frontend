export default function ExecutiveMetricsGrid() {
  const metrics = [
    {
      title: "جاهزية الموارد البشرية",
      value: "84%",
      status: "ممتاز",
      trend: "+4%",
      color: "emerald",
    },
    {
      title: "كفاءة العمليات",
      value: "76%",
      status: "تحتاج متابعة",
      trend: "-2%",
      color: "amber",
    },
    {
      title: "تبني الذكاء الاصطناعي",
      value: "91%",
      status: "أداء مرتفع",
      trend: "+9%",
      color: "sky",
    },
    {
      title: "سرعة اتخاذ القرار",
      value: "68%",
      status: "قيد التحسن",
      trend: "+6%",
      color: "violet",
    },
  ];

  const colors: Record<string, string> = {
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    sky: "bg-sky-500",
    violet: "bg-violet-500",
  };

  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.title}
          className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div
              className={`h-3 w-3 rounded-full ${colors[metric.color]}`}
            />

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
              {metric.trend}
            </span>
          </div>

          <p className="mt-6 text-sm font-bold text-slate-500">
            {metric.title}
          </p>

          <h3 className="mt-3 text-5xl font-black tracking-tight text-slate-950">
            {metric.value}
          </h3>

          <div className="mt-6">
            <div className="h-2 rounded-full bg-slate-200">
              <div
                className={`h-2 rounded-full ${colors[metric.color]}`}
                style={{ width: metric.value }}
              />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500">
              الحالة
            </span>

            <span className="text-sm font-black text-slate-800">
              {metric.status}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}