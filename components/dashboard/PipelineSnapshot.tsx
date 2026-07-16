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
  return new Intl.NumberFormat("en-SA", {
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
      value: totalCompanies.toLocaleString(),
    },
    {
      icon: Users,
      title: "الفرص المسجلة",
      value: totalLeads.toLocaleString(),
    },
    {
      icon: CircleDollarSign,
      title: "قيمة المسار",
      value: formatPipelineValue(pipelineValue),
    },
    {
      icon: Target,
      title: "معدل التحويل",
      value: `${conversionRate}%`,
    },
  ];

  return (
    <section className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)] lg:col-span-2 sm:p-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand-primary)]">
          Business Pipeline
        </p>

        <h2 className="mt-1 text-2xl font-black text-[var(--text-primary)]">
          ملخص مسار الأعمال
        </h2>

        <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
          نظرة تنفيذية على حجم الفرص التجارية وقيمة المسار ومعدل التحويل.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.title}
              className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-5"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                <Icon size={18} />
              </span>

              <p className="mt-4 text-sm font-bold text-[var(--text-muted)]">
                {metric.title}
              </p>

              <h3
                className="mt-2 text-2xl font-black text-[var(--text-primary)]"
                dir={metric.title === "قيمة المسار" ? "ltr" : undefined}
              >
                {metric.value}
              </h3>
            </article>
          );
        })}
      </div>
    </section>
  );
}