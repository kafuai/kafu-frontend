"use client";

type MaturityItem = {
  label: string;
  value: number;
};

type ExecutiveMaturityChartProps = {
  title?: string;
  subtitle?: string;
  items: MaturityItem[];
};

function getBarColor(value: number) {
  if (value >= 80) return "bg-slate-950";
  if (value >= 65) return "bg-sky-500";
  return "bg-amber-500";
}

export default function ExecutiveMaturityChart({
  title = "Executive Maturity",
  subtitle = "مقارنة مختصرة لمستويات النضج عبر المحاور التشغيلية الرئيسية.",
  items,
}: ExecutiveMaturityChartProps) {
  const data = items.slice(0, 6).map((item) => ({
    name: item.label,
    value: Math.min(Math.max(item.value, 0), 100),
  }));

  const strongest = data.reduce(
    (best, item) => (item.value > best.value ? item : best),
    data[0] || { name: "N/A", value: 0 },
  );

  return (
    <div className="group overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(15,23,42,0.10)] sm:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-600">
            Maturity View
          </p>

          <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
            {title}
          </h3>

          <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-slate-500">
            {subtitle}
          </p>
        </div>

        <div className="shrink-0 rounded-[1.5rem] border border-sky-100 bg-sky-50 px-5 py-4 text-sky-950 shadow-sm">
          <p className="text-xs font-bold text-sky-700">Strongest Area</p>
          <p className="mt-1 text-2xl font-black">{strongest.name}</p>
        </div>
      </div>

      <div className="mt-8 rounded-[1.75rem] border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-5">
        <div className="space-y-5">
          {data.map((item) => (
            <div key={item.name}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <p className="text-sm font-black text-slate-700">{item.name}</p>
                <p className="text-sm font-black text-slate-950">{item.value}%</p>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full ${getBarColor(item.value)} transition-all duration-700`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}