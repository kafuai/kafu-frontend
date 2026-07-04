type Props = {
  completed: number;
  total: number;
};

export default function ExecutiveProgress({ completed, total }: Props) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
        Executive Journey
      </p>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h3 className="text-3xl font-bold text-slate-900">
            {completed} / {total}
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Discovery questions completed.
          </p>
        </div>

        <p className="text-2xl font-bold text-emerald-600">
          {percentage}%
        </p>
      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-emerald-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </section>
  );
}