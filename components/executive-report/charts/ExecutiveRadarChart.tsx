"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type RadarItem = {
  label: string;
  value: number;
};

type ExecutiveRadarChartProps = {
  title?: string;
  subtitle?: string;
  items: RadarItem[];
};

export default function ExecutiveRadarChart({
  title = "Executive Radar",
  subtitle = "Executive overview across key business dimensions.",
  items,
}: ExecutiveRadarChartProps) {
  const safeItems = items.slice(0, 6).map((item) => ({
    subject: item.label,
    value: Math.min(Math.max(item.value, 0), 100),
  }));

  const average = Math.round(
    safeItems.reduce((sum, item) => sum + item.value, 0) /
      Math.max(safeItems.length, 1),
  );

  return (
    <div className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(15,23,42,0.09)] sm:p-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-600">
            Intelligence Chart
          </p>

          <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
            {title}
          </h3>

          <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-slate-500">
            {subtitle}
          </p>
        </div>

        <div className="shrink-0 rounded-[1.35rem] border border-slate-800 bg-slate-950 px-5 py-3 text-white shadow-[0_14px_35px_rgba(15,23,42,0.16)]">
          <p className="text-xs font-bold text-slate-300">
            Average Readiness
          </p>

          <p className="mt-1 text-2xl font-black">{average}%</p>
        </div>
      </div>

      <div className="relative mt-6 rounded-[1.5rem] border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-3">
        <div className="absolute inset-x-8 top-8 h-16 rounded-full bg-emerald-100/50 blur-3xl" />

        <div className="relative h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={safeItems} outerRadius="78%">
              <PolarGrid stroke="#cbd5e1" />

              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />

              <PolarAngleAxis
                dataKey="subject"
                tick={{
                  fontSize: 12,
                  fontWeight: 800,
                  fill: "#334155",
                }}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 18px 45px rgba(15,23,42,0.12)",
                  fontWeight: 700,
                }}
              />

              <Radar
                name="Readiness"
                dataKey="value"
                stroke="#0f172a"
                fill="#10b981"
                fillOpacity={0.28}
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#0f172a",
                  strokeWidth: 2,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}