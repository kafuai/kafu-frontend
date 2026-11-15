type GrowthPoint = {
  label: string;
  value: number;
};

type ExecutiveGrowthCurveProps = {
  data: GrowthPoint[];
};

export default function ExecutiveGrowthCurve({
  data,
}: ExecutiveGrowthCurveProps) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-[520px] items-end gap-4 rounded-[1.75rem] border border-slate-200 bg-white/80 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.04)]">
        {data.map((item) => {
          const safeValue = Math.min(Math.max(item.value, 0), 100);
          const height = Math.max((safeValue / maxValue) * 100, 10);

          return (
            <div
              key={item.label}
              className="group flex flex-1 flex-col items-center justify-end gap-3"
            >
              <div className="flex h-52 w-full items-end rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 p-2 shadow-inner">
                <div
                  className="w-full rounded-xl bg-gradient-to-t from-emerald-500 via-sky-500 to-indigo-600 shadow-[0_0_24px_rgba(14,165,233,0.28)] transition-all duration-700 ease-out group-hover:shadow-[0_0_32px_rgba(14,165,233,0.38)]"
                  style={{ height: `${height}%` }}
                />
              </div>

              <div className="text-center">
                <p className="text-sm font-black text-slate-950">
                  {safeValue}%
                </p>

                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  {item.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}