import { Building2 } from "lucide-react";

import CompanyStats from "./CompanyStats";

type CompanyHeroProps = {
  locale: "ar" | "en";
  name: string;
  industry: string | null;
  country: string | null;
  employees: number | null;
};

export default function CompanyHero({
  locale,
  name,
  industry,
  country,
  employees,
}: CompanyHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] px-5 py-5 shadow-[var(--shadow-small)] sm:px-6 sm:py-6 lg:px-7 lg:py-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 start-0 w-1 bg-[var(--brand-primary)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-24 -top-24 h-60 w-60 rounded-full bg-[color-mix(in_srgb,var(--brand-primary)_5%,transparent)]"
      />

      <div className="relative">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-3.5 sm:gap-4">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-[color-mix(in_srgb,var(--brand-primary)_14%,var(--border-default))] bg-[var(--brand-subtle)] text-[var(--brand-primary)] shadow-[var(--shadow-small)]">
              <Building2 size={20} />
            </span>

            <div className="min-w-0">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--brand-primary)]">
                {locale === "ar"
                  ? "مساحة عمل المؤسسة"
                  : "Company Workspace"}
              </p>

              <h2 className="mt-2 break-words text-2xl font-extrabold leading-tight tracking-[-0.035em] text-[var(--text-primary)] sm:text-3xl">
                {name}
              </h2>

              <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-[var(--text-secondary)]">
                {locale === "ar"
                  ? "واجهة تنفيذية موحدة لمتابعة الجاهزية المؤسسية والمؤشرات والإجراءات والتنبيهات ذات الأولوية."
                  : "A unified executive view of enterprise readiness, performance indicators, actions, and priority alerts."}
              </p>
            </div>
          </div>

          <span className="inline-flex min-h-10 w-fit shrink-0 items-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--success)_18%,var(--border-default))] bg-[var(--success-background)] px-3.5 text-xs font-extrabold text-[var(--success)] shadow-[var(--shadow-small)]">
            <span className="h-2 w-2 rounded-full bg-[var(--success)]" />

            {locale === "ar"
              ? "بيانات المؤسسة متصلة"
              : "Company data connected"}
          </span>
        </div>

        <CompanyStats
          locale={locale}
          industry={industry}
          country={country}
          employeeCount={employees}
        />
      </div>
    </section>
  );
}

