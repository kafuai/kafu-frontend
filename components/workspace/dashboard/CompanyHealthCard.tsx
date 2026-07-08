export default function CompanyHealthCard() {
  const healthItems = [
    { label: "Operational Health", value: "84%", status: "Stable" },
    { label: "People Readiness", value: "79%", status: "Improving" },
    { label: "Payroll Confidence", value: "91%", status: "Ready" },
  ];

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-slate-500">Company Health</p>
        <h3 className="mt-2 text-2xl font-black text-slate-950">
          صحة الشركة التشغيلية
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          مؤشر تنفيذي يلخص جاهزية الشركة من زاوية العمليات، الموارد البشرية،
          والرواتب قبل الانتقال إلى العرض التجريبي.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {healthItems.map((item) => (
          <div key={item.label} className="rounded-3xl bg-slate-50 p-5">
            <p className="text-xs font-bold text-slate-500">{item.label}</p>
            <p className="mt-3 text-3xl font-black text-slate-950">
              {item.value}
            </p>
            <p className="mt-2 text-sm font-bold text-emerald-700">
              {item.status}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
