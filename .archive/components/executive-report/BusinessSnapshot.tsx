type BusinessSnapshotProps = {
  companyName?: string | null;
  industry?: string | null;
  country?: string | null;
  employeeCount?: number | null;
};

export default function BusinessSnapshot({
  companyName,
  industry,
  country,
  employeeCount,
}: BusinessSnapshotProps) {
  const items = [
    {
      label: "Company",
      value: companyName || "Not provided",
      note: "Primary business identity",
    },
    {
      label: "Industry",
      value: industry || "Not provided",
      note: "Operating sector",
    },
    {
      label: "Country",
      value: country || "Not provided",
      note: "Market context",
    },
    {
      label: "Employees",
      value: employeeCount ? employeeCount.toLocaleString() : "Not provided",
      note: "Organizational scale",
    },
  ];

  return (
    <section className="h-full overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.07)]">
      <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative">
          <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
            Business Snapshot
          </span>

          <h2 className="mt-5 text-3xl font-black leading-tight md:text-4xl">
            ملخص الشركة التنفيذي
          </h2>

          <p className="mt-4 max-w-2xl leading-8 text-slate-300">
            نظرة مركزة على البيانات الأساسية التي تشكل سياق التقرير التنفيذي
            والتحليل الاستراتيجي.
          </p>
        </div>
      </div>

      <div className="grid gap-0 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="group border-b border-slate-200 p-6 transition hover:bg-slate-50 sm:border-l [&:nth-child(2n)]:sm:border-l-0 [&:nth-last-child(-n+2)]:sm:border-b-0"
          >
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
              {item.label}
            </p>

            <p className="mt-4 text-2xl font-black leading-tight text-slate-950">
              {item.value}
            </p>

            <p className="mt-3 text-sm font-bold leading-6 text-slate-500">
              {item.note}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-6">
        <p className="text-sm font-bold leading-7 text-slate-700">
          This snapshot anchors the executive report in the company’s current
          operating context before generating strategic recommendations.
        </p>
      </div>
    </section>
  );
}