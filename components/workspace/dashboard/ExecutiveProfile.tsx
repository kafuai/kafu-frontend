export default function ExecutiveProfile() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-950 text-xl font-black text-white">
          CEO
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-950">
            Executive Workspace
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            AI Powered Decision Center
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-4">

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Executive Role
          </p>

          <p className="mt-2 text-lg font-black text-slate-950">
            Chief Executive Officer
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <p className="mt-2 text-lg font-black text-slate-950">
            KAFU AI Executive Command Center
          </p>
        </div>

        <div className="rounded-3xl bg-slate-950 p-6 text-white">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-300">
              AI Confidence Score
            </p>

            <span className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>

          <h3 className="mt-4 text-5xl font-black">
            96%
          </h3>

          <div className="mt-5 h-2 rounded-full bg-white/20">
            <div className="h-2 w-[96%] rounded-full bg-emerald-400" />
          </div>

          <p className="mt-4 text-xs text-slate-300">
            Executive AI Engine operating normally.
          </p>
        </div>

      </div>
    </section>
  );
}