export default function SystemStatus() {
  const systems = [
    {
      name: "AI Core Engine",
      status: "نشط",
      value: "99.8%",
      color: "bg-emerald-500",
    },
    {
      name: "HR Intelligence",
      status: "نشط",
      value: "94%",
      color: "bg-sky-500",
    },
    {
      name: "Recommendation Engine",
      status: "قيد التطوير",
      value: "71%",
      color: "bg-amber-500",
    },
  ];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-950">
            حالة النظام
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            مراقبة خدمات KAFU AI في الوقت الحقيقي.
          </p>
        </div>

        <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
          ● Online
        </span>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        {systems.map((system) => (
          <div
            key={system.name}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-6 transition-all duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-950">
                  {system.name}
                </h3>

                <p className="mt-2 text-sm font-semibold text-slate-500">
                  {system.status}
                </p>
              </div>

              <span className="text-3xl font-black text-slate-900">
                {system.value}
              </span>
            </div>

            <div className="mt-5 h-2.5 rounded-full bg-slate-200">
              <div
                className={`h-2.5 rounded-full ${system.color}`}
                style={{ width: system.value }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}