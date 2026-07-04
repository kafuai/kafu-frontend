export default function ProgressCard() {
  const progress = 68;

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            Discovery Progress
          </p>
          <h2 className="mt-1 text-xl font-black text-slate-900">
            تقدم المرحلة
          </h2>
        </div>

        <span className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-black text-white">
          {progress}%
        </span>
      </div>

      <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-slate-950 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Completed</p>
          <p className="mt-1 text-2xl font-black text-slate-900">30</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Total</p>
          <p className="mt-1 text-2xl font-black text-slate-900">44</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Remaining</p>
          <p className="mt-1 text-2xl font-black text-slate-900">14</p>
        </div>
      </div>
    </div>
  );
}