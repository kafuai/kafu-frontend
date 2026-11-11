// Sidebar.tsx
import { FileText, LockKeyhole } from "lucide-react";

export default function Sidebar({ t }: { t: any }) {
  return (
    <aside className="space-y-5">
      <section className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <FileText size={18} />
          </span>
          <h2 className="font-black text-[var(--text-primary)]">{t.sidebar.guidelinesTitle}</h2>
        </div>
        <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--text-secondary)]">
          <p>{t.sidebar.guidelinesDesc}</p>
        </div>
      </section>

      <section className="rounded-[24px] border border-slate-200 bg-slate-950 p-6 text-white">
        <div className="flex items-center gap-3">
          <LockKeyhole size={18} className="text-emerald-300" />
          <h2 className="font-black">{t.sidebar.privacyTitle}</h2>
        </div>
        <p className="mt-4 text-sm leading-7 text-slate-300">{t.sidebar.privacyDesc}</p>
      </section>
    </aside>
  );
}