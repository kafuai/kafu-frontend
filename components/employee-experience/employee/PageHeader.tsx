import { CheckCircle2, Headphones, Sparkles } from "lucide-react";
import { useAppCopy } from "./useAppCopy";

export default function PageHeader({ isArabic }: { isArabic: boolean }) {
  const { copy } = useAppCopy(isArabic);

  return (
    <section className="flex flex-col gap-4 rounded-[24px] border border-[var(--border)] bg-white px-5 py-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-primary)] text-white shadow-sm">
          <Sparkles size={23} strokeWidth={1.8} />
        </div>

        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)] sm:text-2xl">
              {copy.headerTitle}
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {copy.headerReady}
            </span>
          </div>

          <p className="text-sm text-slate-500">{copy.headerSubtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[var(--brand-primary)] shadow-sm">
          <Headphones size={18} strokeWidth={1.8} />
        </div>

        <div>
          <p className="text-xs font-medium text-slate-700">{copy.hrSupportTitle}</p>
          <p className="mt-0.5 text-[11px] text-slate-400">{copy.hrSupportSubtitle}</p>
        </div>

        <CheckCircle2 className="mr-1 text-emerald-500" size={17} strokeWidth={1.8} />
      </div>
    </section>
  );
}