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
    <section className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-medium)] md:p-8">
      <div className="flex items-start gap-4">
        <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
          <Building2 size={25} />
        </span>

        <div>
          <p className="text-xs font-black uppercase tracking-wider text-[var(--brand-primary)]">
            {locale === "ar"
              ? "مساحة عمل المؤسسة"
              : "Company Workspace"}
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--text-primary)] md:text-4xl">
            {name}
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-[var(--text-secondary)]">
            {locale === "ar"
              ? "مساحة موحدة لمتابعة جاهزية المؤسسة والمؤشرات والمهام والتنبيهات التنفيذية."
              : "A unified workspace for enterprise readiness, KPIs, tasks, and executive alerts."}
          </p>
        </div>
      </div>

      <CompanyStats
        locale={locale}
        industry={industry}
        country={country}
        employeeCount={employees}
      />
    </section>
  );
}