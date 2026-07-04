type InsightCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon?: string;
  trend?: string;
};

export default function InsightCard({
  title,
  value,
  subtitle,
  icon = "✦",
  trend = "+12%",
}: InsightCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-slate-100 opacity-70 transition group-hover:scale-125" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h3 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
            {value}
          </h3>

          {subtitle && (
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-xl text-white shadow-sm">
          {icon}
        </div>
      </div>

      <div className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs font-medium text-slate-500">
          مقارنة بالمرحلة السابقة
        </span>

        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
          {trend}
        </span>
      </div>
    </div>
  );
}