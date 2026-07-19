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
      label: locale === "ar" ? "��� ��������" : "Employees",
      value:
        employeeCount !== null
          ? employeeCount.toLocaleString(
              locale === "ar" ? "ar-SA" : "en-US",
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
      label: locale === "ar" ? "������" : "Industry",
      value:
        industry ||
        (locale === "ar" ? "غير محدد" : "Not specified"),
      icon: BriefcaseBusiness,
    },
  ];

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article
            key={stat.label}
            className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-5"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand-primary)]">
                <Icon size={18} />
              </span>

              <p className="text-xs font-bold text-[var(--text-muted)]">
                {stat.label}
              </p>
            </div>

            <p
              className="mt-4 truncate text-xl font-black text-[var(--text-primary)]"
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
