type PipelineSnapshotProps = {
  totalCompanies: number;
  totalLeads: number;
  pipelineValue: number;
  conversionRate: number;
};

export default function PipelineSnapshot({
  totalCompanies,
  totalLeads,
  pipelineValue,
  conversionRate,
}: PipelineSnapshotProps) {
  const metrics = [
    {
      title: "الشركات المسجلة",
      value: totalCompanies.toString(),
    },
    {
      title: "Leads",
      value: totalLeads.toString(),
    },
    {
      title: "Pipeline Value",
      value: `${pipelineValue.toLocaleString()} SAR`,
    },
    {
      title: "Conversion",
      value: `${conversionRate}%`,
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-700 bg-white p-8 text-slate-900 shadow-xl">
      <h2 className="text-3xl font-bold">
        Business Pipeline Snapshot
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="rounded-2xl bg-slate-100 p-5"
          >
            <p className="text-slate-500">
              {metric.title}
            </p>

            <h3 className="mt-3 text-3xl font-black">
              {metric.value}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}