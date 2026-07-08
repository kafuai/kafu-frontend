export default function PayrollReadinessCard() {
  const items = [
    { label: "Payroll Accuracy", value: "98%" },
    { label: "Employees Covered", value: "245" },
    { label: "Pending Issues", value: "2" },
    { label: "Next Payroll", value: "Ready" },
  ];

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">Payroll Readiness</p>
          <h3 className="mt-2 text-2xl font-black text-slate-950">
            جاهزية الرواتب
          </h3>
        </div>

        <div className="rounded-2xl bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-700">
          READY
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">{item.label}</p>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
