import {
  Building2,
  CircleDollarSign,
  Target,
  Users,
} from "lucide-react";

type PipelineSnapshotProps = {
  totalCompanies: number;
  totalLeads: number;
  pipelineValue: number;
  conversionRate: number;
};

function formatPipelineValue(value: number) {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PipelineSnapshot({
  totalCompanies,
  totalLeads,
  pipelineValue,
  conversionRate,
}: PipelineSnapshotProps) {
  const metrics = [
    {
      icon: Building2,
      title: "الشركات المسجلة",
      value: totalCompanies.toLocaleString("ar-SA"),
      direction: "rtl",
    },
    {
      icon: Users,
      title: "الفرص المسجلة",
      value: totalLeads.toLocaleString("ar-SA"),
      direction: "rtl",
    },
    {
      icon: CircleDollarSign,
      title: "قيمة المسار",
      value: formatPipelineValue(pipelineValue),
      direction: "rtl",
    },
    {
      icon: Target,
      title: "معدل التحويل",
      value: `${conversionRate}%`,
      direction: "ltr",
    },
  ];

  return (
    <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)] lg:col-span-2">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-primary)]">
          Business Pipeline
        </p>

        <h2 className="mt-1 text-xl font-bold text-[var(--text-primary)]">
          ملخص مسار الأعمال
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--text-muted)]">
          نظرة تنفيذية على حجم الفرص التجارية وقيمة المسار ومعدل التحويل.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.title}
              className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-muted)]">
                    {metric.title}
                  </p>

                  <p
                    className="mt-2 text-2xl font-bold tracking-tight text-[var(--text-primary)]"
                    dir={metric.direction}
                  >
                    {metric.value}
                  </p>
                </div>

                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                  <Icon size={17} />
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
