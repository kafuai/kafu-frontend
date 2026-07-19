import {
  Activity,
  Cpu,
  Sparkles,
} from "lucide-react";

const systems = [
  {
    name: "محرك KAFU AI",
    status: "نشط",
    value: "99.8%",
    width: "w-[99.8%]",
    color: "bg-emerald-500",
    icon: Cpu,
  },
  {
    name: "ذكاء الموارد البشرية",
    status: "نشط",
    value: "94%",
    width: "w-[94%]",
    color: "bg-sky-500",
    icon: Activity,
  },
  {
    name: "محرك التوصيات",
    status: "قيد التطوير",
    value: "71%",
    width: "w-[71%]",
    color: "bg-amber-500",
    icon: Sparkles,
  },
];

export default function SystemStatus() {
  return (
    <section
      dir="rtl"
      className="rounded-3xl border border-slate-200 bg-white p-5 text-right shadow-sm"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-950">
            حالة النظام
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            مراقبة خدمات KAFU AI في الوقت الفعلي.
          </p>
        </div>

        <span className="inline-flex min-h-7 w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 text-[11px] font-black text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          جميع الأنظمة متصلة
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {systems.map((system) => {
          const Icon = system.icon;

          return (
            <article
              key={system.name}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 transition hover:border-slate-300 hover:bg-white hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                    <Icon size={16} />
                  </span>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-black text-slate-950">
                      {system.name}
                    </h3>

                    <p className="mt-0.5 text-[11px] font-bold text-slate-500">
                      {system.status}
                    </p>
                  </div>
                </div>

                <span className="text-base font-black text-slate-900">
                  {system.value}
                </span>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full ${system.width} ${system.color}`}
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}