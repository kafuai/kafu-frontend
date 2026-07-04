type Props = {
  industry: string | null;
  country: string | null;
  employeeCount: number | null;
};

export default function CompanyStats({
  industry,
  country,
  employeeCount,
}: Props) {
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-3">
      <div className="rounded-2xl bg-slate-100 p-6 text-center">
        <p className="text-sm text-slate-500">
          Employees
        </p>

        <p className="mt-2 text-4xl font-bold text-slate-900">
          {employeeCount ?? "-"}
        </p>
      </div>

      <div className="rounded-2xl bg-slate-100 p-6 text-center">
        <p className="text-sm text-slate-500">
          Country
        </p>

        <p className="mt-2 text-3xl font-semibold">
          {country || "-"}
        </p>
      </div>

      <div className="rounded-2xl bg-slate-100 p-6 text-center">
        <p className="text-sm text-slate-500">
          Industry
        </p>

        <p className="mt-2 text-3xl font-semibold">
          {industry || "-"}
        </p>
      </div>
    </div>
  );
}