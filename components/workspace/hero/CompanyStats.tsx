import { BriefcaseBusiness, MapPin, Users } from "lucide-react";

type CompanyStatsProps = {
  locale: "ar" | "en";
  industry: string | null;
  country: string | null;
  employeeCount: number | null;
};

export default function CompanyStats({
  locale,
  industry,
  country,
  employeeCount,
}: CompanyStatsProps) {
  const stats = [
    {
      label: locale === "ar" ? "عدد الموظفين" : "Employees",
      value:
        employeeCount !== null
          ? employeeCount.toLocaleString(
              locale === "ar" ? "ar-BH" : "en-US",
            )
          : locale === "ar"
            ? "غير محدد"
            : "Not specified",
      icon: Users,
      forceLtr: true,
    },
    {
      label: locale === "ar" ? "الدولة" : "Country",
      value:
        country ||
        (locale === "ar" ? "غير محددة" : "Not specified"),
      icon: MapPin,
      forceLtr: Boolean(country && /[A-Za-z]/.test(country)),
    },
    {
      label: locale === "ar" ? "القطاع" : "Industry",
      value:
        industry ||
        (locale === "ar" ? "غير محدد" : "Not specified"),
      icon: BriefcaseBusiness,
      forceLtr: Boolean(industry && /[A-Za-z]/.test(industry)),
    },
  ];

  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article
            key={stat.label}
            className="group rounded-[15px] border border-[var(--border-default)] bg-[var(--surface-muted)] px-4 py-3.5 transition duration-200 hover:border-[color-mix(in_srgb,var(--brand-primary)_24%,var(--border-default))] hover:bg-[var(--surface)]"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[var(--surface)] text-[var(--brand-primary)] shadow-[var(--shadow-small)]">
                <Icon size={17} />
              </span>

              <div className="min-w-0">
                <p className="text-xs font-bold text-[var(--text-muted)]">
                  {stat.label}
                </p>

                <p
                  className="mt-1 truncate text-base font-extrabold text-[var(--text-primary)]"
                  title={stat.value}
                  dir={stat.forceLtr ? "ltr" : undefined}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
