import {
  BrainCircuit,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function AICommandCenter() {
  return (
    <section
      dir="rtl"
      className="relative h-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 text-right shadow-sm sm:p-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-6 top-6 h-20 w-20 rounded-full bg-emerald-100/70 blur-3xl"
      />

      <div className="relative grid h-full items-center gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-emerald-600">
            <BrainCircuit size={17} />

            <p className="text-xs font-black uppercase tracking-[0.12em]">
              AI Command Center
            </p>
          </div>

          <h2 className="mt-2.5 text-2xl font-black tracking-tight text-slate-950">
            حالة الذكاء الاصطناعي
          </h2>

          <p className="mt-2.5 max-w-2xl text-sm leading-6 text-slate-500">
            يقوم KAFU AI بتحليل المؤشرات والتنبيهات والقرارات لتقديم قراءة
            تنفيذية مختصرة وواضحة لصنّاع القرار.
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            <span className="inline-flex min-h-7 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 text-[11px] font-bold text-emerald-700">
              <CheckCircle2 size={13} />
              محرك الذكاء نشط
            </span>

            <span className="inline-flex min-h-7 items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 text-[11px] font-bold text-slate-600">
              <Sparkles size={13} />
              الرؤى التنفيذية جاهزة
            </span>
          </div>
        </div>

        <div className="self-center rounded-2xl border border-slate-200 bg-slate-50 p-4.5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold text-slate-500">
              معالجة الذكاء
            </p>

            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </div>

          <div className="mt-2.5 flex items-end justify-between gap-3">
            <p className="text-3xl font-black tracking-tight text-slate-950">
              96%
            </p>

            <span className="pb-0.5 text-[10px] font-black text-emerald-600">
              مباشر
            </span>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-[96%] rounded-full bg-emerald-500" />
          </div>

          <p className="mt-2.5 text-[11px] font-bold leading-5 text-slate-500">
            التحليل التنفيذي يعمل بكفاءة.
          </p>
        </div>
      </div>
    </section>
  );
}