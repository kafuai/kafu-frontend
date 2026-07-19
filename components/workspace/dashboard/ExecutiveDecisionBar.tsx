import Link from "next/link";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Clock3,
} from "lucide-react";

const decisions = [
  {
    title: "اعتماد سياسة العمل المرن",
    priority: "عالية",
    waiting: "بانتظارك منذ يومين",
    impact: "أثر مباشر على تجربة الموظفين واستقرار فرق العمل.",
    tone: "border-rose-200 bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
  },
  {
    title: "مراجعة خطة التوظيف",
    priority: "متوسطة",
    waiting: "بانتظارك منذ 6 ساعات",
    impact: "مرتبطة بسرعة التوسع وتغطية الاحتياجات التشغيلية.",
    tone: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  {
    title: "الموافقة على ميزانية التدريب",
    priority: "منخفضة",
    waiting: "بانتظارك منذ 30 دقيقة",
    impact: "تحسين جاهزية الفريق وبناء القدرات المؤسسية.",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
];

export default function ExecutiveDecisionBar() {
  return (
    <section
      dir="rtl"
      className="rounded-3xl border border-slate-200 bg-white p-5 text-right shadow-sm"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-blue-600">
            Executive Decision Center
          </p>

          <h2 className="mt-1.5 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
            القرارات التي تحتاج موافقتك
          </h2>

          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
            قرارات مرتبة حسب الأولوية مع توضيح موجز للأثر التنفيذي ومدة
            الانتظار.
          </p>
        </div>

        <Link
          href="/command-center"
          className="inline-flex min-h-9 w-fit shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3.5 text-xs font-black text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
        >
          عرض جميع القرارات
          <ArrowLeft size={15} />
        </Link>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {decisions.map((decision) => (
          <article
            key={decision.title}
            className="flex min-h-[215px] flex-col rounded-2xl border border-slate-200 bg-slate-50/75 p-3.5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <span
                className={`inline-flex min-h-6 items-center rounded-full border px-2.5 text-[10px] font-black ${decision.tone}`}
              >
                أولوية {decision.priority}
              </span>

              <span className={`h-2 w-2 rounded-full ${decision.dot}`} />
            </div>

            <h3 className="mt-3 text-base font-black leading-6 text-slate-950">
              {decision.title}
            </h3>

            <p className="mt-1.5 flex-1 text-xs leading-5 text-slate-600">
              {decision.impact}
            </p>

            <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
              <CalendarClock size={14} className="shrink-0 text-slate-400" />

              <div>
                <p className="text-[9px] font-bold text-slate-400">
                  حالة القرار
                </p>

                <p className="mt-0.5 text-[11px] font-black text-slate-700">
                  {decision.waiting}
                </p>
              </div>
            </div>

            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <button
                type="button"
                className="inline-flex min-h-8 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 text-[11px] font-black text-white transition hover:bg-blue-700"
              >
                <CheckCircle2 size={13} />
                مراجعة
              </button>

              <button
                type="button"
                className="inline-flex min-h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-black text-slate-600 transition hover:border-slate-300 hover:bg-slate-100"
              >
                <Clock3 size={13} />
                لاحقًا
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}