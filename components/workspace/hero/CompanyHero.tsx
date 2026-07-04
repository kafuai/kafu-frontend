import CompanyStats from "./CompanyStats";

type CompanyHeroProps = {
  name: string;
  industry: string | null;
  country: string | null;
  employees: number | null;
};

export default function CompanyHero({
  name,
  industry,
  country,
  employees,
}: CompanyHeroProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">
          {name}
        </h1>

        <p className="mt-2 text-slate-500">
          Company Workspace
        </p>
      </div>

      <CompanyStats
        industry={industry}
        country={country}
        employeeCount={employees}
      />
    </section>
  );
}