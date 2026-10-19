type RadarItem = {
  label: string;
  score: number;
};

type ExecutiveRadarChartProps = {
  data: RadarItem[];
};

export default function ExecutiveRadarChart({
  data,
}: ExecutiveRadarChartProps) {
  return (
    <div className="space-y-5">
      {data.map((item) => {
        const safeScore = Math.min(Math.max(item.score, 0), 100);

        return (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="text-sm font-black text-slate-800">
                {item.label}
              </span>

              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-black text-slate-950">
                {safeScore}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-100 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-600 shadow-[0_0_18px_rgba(14,165,233,0.35)] transition-all duration-700 ease-out"
                style={{
                  width: `${safeScore}%`,
                }}
              />
            </div>

            <div className="mt-3 flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              <span>Low</span>
              <span>Enterprise</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}