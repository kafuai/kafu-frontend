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
    },
    {
      label: locale === "ar" ? "الدولة" : "Country",
      value:
        country ||
        (locale === "ar" ? "غير محددة" : "Not specified"),
      icon: MapPin,
    },
    {
      label: locale === "ar" ? "القطاع" : "Industry",
      value:
        industry ||
        (locale === "ar" ? "غير محدد" : "Not specified"),
      icon: BriefcaseBusiness,
    },
  ];

  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article
            key={stat.label}
            className="group rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-muted)] p-4 transition hover:border-[color-mix(in_srgb,var(--brand-primary)_24%,var(--border-default))] hover:bg-[var(--surface)]"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand-primary)] shadow-[var(--shadow-small)]">
                <Icon size={17} />
              </span>

              <p className="text-xs font-bold text-[var(--text-muted)]">
                {stat.label}
              </p>
            </div>

            <p
              className="mt-3 truncate text-base font-extrabold text-[var(--text-primary)] sm:text-lg"
              title={stat.value}
            >
              {stat.value}
            </p>
          </article>
        );
      })}
    </div>
  );
}
