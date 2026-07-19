import {
  BrainCircuit,
  BriefcaseBusiness,
  ShieldCheck,
} from "lucide-react";

export default function ExecutiveProfile() {
  return (
    <section
      dir="rtl"
      className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 text-right shadow-sm sm:p-6"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-xs font-black text-white">
          CEO
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-black leading-6 text-slate-950">
            مساحة القيادة التنفيذية
          </h2>

          <p className="mt-0.5 text-xs font-bold leading-5 text-slate-500">
            مركز قرارات مدعوم بالذكاء الاصطناعي
          </p>
        </div>
      </div>

      <div className="mt-4 grid flex-1 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
          <div className="flex items-center gap-2 text-slate-400">
            <BriefcaseBusiness size={14} />

            <p className="text-[10px] font-black uppercase tracking-wider">
              الدور التنفيذي
            </p>
          </div>

          <p className="mt-1.5 text-sm font-black text-slate-950">
            الرئيس التنفيذي
          </p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-blue-700">
              <BrainCircuit size={15} />

              <p className="text-[11px] font-black">
                درجة ثقة الذكاء الاصطناعي
              </p>
            </div>

            <ShieldCheck size={15} className="text-emerald-600" />
          </div>

          <div className="mt-2.5 flex items-end justify-between gap-4">
            <h3 className="text-3xl font-black tracking-tight text-slate-950">
              96%
            </h3>

            <span className="pb-0.5 text-[10px] font-black text-emerald-600">
              يعمل بكفاءة
            </span>
          </div>

          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-blue-100">
            <div className="h-full w-[96%] rounded-full bg-blue-600" />
          </div>
        </div>
      </div>
    </section>
  );
}