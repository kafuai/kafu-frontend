export default function WorkspaceHeader() {
  return (
    <header className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Company Command Workspace
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
            Active
          </div>

          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
            Phase 2
          </div>
        </div>
      </div>
    </header>
  );
}