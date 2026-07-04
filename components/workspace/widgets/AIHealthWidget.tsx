type Props = {
  score: number;
};

export default function AIHealthWidget({ score }: Props) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
            🧠
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
              AI Health
            </p>

            <h3 className="mt-1 text-3xl font-bold text-slate-900">
              {score}% Ready
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Overall AI readiness based on completed assessments.
            </p>
          </div>
        </div>

        <div className="hidden w-64 md:block">
          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}