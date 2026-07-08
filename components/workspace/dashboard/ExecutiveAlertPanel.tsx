export default function ExecutiveAlertPanel() {
  const alerts = [
    {
      level: "High",
      title: "Pending Executive Approval",
    },
    {
      level: "Medium",
      title: "Process Optimization Opportunity",
    },
    {
      level: "Low",
      title: "Payroll Ready for Release",
    },
  ];

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">
        Executive Alerts
      </p>

      <h3 className="mt-2 text-2xl font-black text-slate-950">
        التنبيهات التنفيذية
      </h3>

      <div className="mt-6 space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.title}
            className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"
          >
            <div>
              <p className="font-black text-slate-900">
                {alert.title}
              </p>

              <p className="text-sm text-slate-500">
                Priority: {alert.level}
              </p>
            </div>

            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-black text-white">
              ACTIVE
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
