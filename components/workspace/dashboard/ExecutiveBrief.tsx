import {
  ArrowUpLeft,
  CheckCircle2,
} from "lucide-react";

export default function ExecutiveBrief() {
  return (
    <section
      dir="rtl"
      className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 px-6 py-5 text-right text-white shadow-[0_16px_42px_rgba(15,23,42,0.14)] sm:px-7"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-14 -top-20 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-12 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl"
      />

      <div className="relative grid items-center gap-5 lg:grid-cols-[minmax(0,1fr)_200px]">
        <div>
          <div className="inline-flex min-h-7 items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 text-[11px] font-bold text-slate-300">
            <CheckCircle2 size={14} className="text-emerald-400" />
            الملخص التنفيذي
          </div>

          <h2 className="mt-3 max-w-3xl text-2xl font-black leading-[1.4] tracking-tight">
            شركتك تتحرك باتجاه جاهزية مؤسسية أعلى
          </h2>

          <p className="mt-2.5 max-w-4xl text-sm leading-6 text-slate-300">
            تظهر المؤشرات الأولية جاهزية تشغيلية جيدة وتجربة موظف مستقرة، مع
            فرص واضحة لتسريع الموافقات وتقليل المخاطر المرتبطة بالتنفيذ.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold text-slate-400">
              جاهزية المؤسسة
            </p>

            <ArrowUpLeft size={16} className="text-emerald-400" />
          </div>

          <div className="mt-2.5 flex items-end gap-2">
            <p className="text-3xl font-black tracking-tight">82%</p>

            <span className="pb-0.5 text-[11px] font-bold text-emerald-400">
              مستقرة
            </span>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[82%] rounded-full bg-emerald-400" />
          </div>
        </div>
      </div>
    </section>
  );
}