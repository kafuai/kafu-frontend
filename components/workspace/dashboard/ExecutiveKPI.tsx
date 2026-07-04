export default function ExecutiveKPI() {
  const kpis = [
    {
      title: "مؤشر الجاهزية",
      value: "82%",
      subtitle: "تحسن ملحوظ في جاهزية الشركة",
      icon: "📈",
      trend: "+18%",
      trendLabel: "مقارنة بالشهر الماضي",
      tone: "emerald",
    },
    {
      title: "طلبات الموظفين",
      value: "24",
      subtitle: "طلبات مفتوحة تحتاج متابعة تنفيذية",
      icon: "🧾",
      trend: "+6",
      trendLabel: "طلبات جديدة هذا الأسبوع",
      tone: "sky",
    },
    {
      title: "المخاطر التشغيلية",
      value: "6",
      subtitle: "مخاطر تحتاج قرار إداري سريع",
      icon: "⚠️",
      trend: "-2",
      trendLabel: "انخفاض في المخاطر الحرجة",
      tone: "rose",
    },
    {
      title: "فرص التحسين",
      value: "11",
      subtitle: "اقتراحات قابلة للتنفيذ خلال 30 يومًا",
      icon: "💡",
      trend: "+4",
      trendLabel: "فرص جديدة قابلة للتنفيذ",
      tone: "amber",
    },
  ];

  const toneClasses: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    sky: "bg-sky-50 text-sky-700 border-sky-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
  };

  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.title}
          className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-xl ${toneClasses[kpi.tone]}`}
            >
              {kpi.icon}
            </div>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-black ${toneClasses[kpi.tone]}`}
            >
              {kpi.trend}
            </span>
          </div>

          <div className="mt-7">
            <p className="text-sm font-bold text-slate-500">{kpi.title}</p>

            <h3 className="mt-3 text-5xl font-black tracking-tight text-slate-950">
              {kpi.value}
            </h3>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              {kpi.subtitle}
            </p>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-bold text-slate-400">المؤشر التنفيذي</p>
            <p className="mt-1 text-sm font-black text-slate-700">
              {kpi.trendLabel}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}