type RoadmapPhase = {
  period: string;
  title: string;
  description: string;
  outcome: string;
};

type NinetyDayRoadmapProps = {
  phases?: RoadmapPhase[];
};

export default function NinetyDayRoadmap({
  phases = [
    {
      period: "30 Days",
      title: "تثبيت Corporate DNA",
      description:
        "تنظيم بيانات الشركة، مراجعة إجابات الاستكشاف، وبناء الطبقة الأولى من الهوية التشغيلية.",
      outcome: "Operational clarity",
    },
    {
      period: "60 Days",
      title: "بناء Corporate Brain",
      description:
        "تحويل المعرفة والسياسات والعمليات إلى طبقة معرفية قابلة للاستخدام داخل KAFU AI.",
      outcome: "Knowledge intelligence",
    },
    {
      period: "90 Days",
      title: "تفعيل Digital Workforce",
      description:
        "اختيار أول عمليات قابلة للأتمتة وبناء وكلاء ذكاء اصطناعي متخصصين لدعم الفريق.",
      outcome: "AI-powered execution",
    },
  ],
}: NinetyDayRoadmapProps) {
  return (
    <section className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="border-b border-slate-200 pb-7">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600">
          90-Day Roadmap
        </p>

        <h2 className="mt-4 text-3xl font-black leading-tight text-slate-950 md:text-4xl">
          خارطة التنفيذ لأول 90 يوم
        </h2>

        <p className="mt-4 max-w-3xl leading-8 text-slate-600">
          خارطة طريق تنفيذية متدرجة تساعد الإدارة على الانتقال من مرحلة
          التقييم إلى مؤسسة مدعومة بالذكاء الاصطناعي خلال أول 90 يومًا.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {phases.map((phase, index) => (
          <article
            key={phase.period}
            className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-7 shadow-sm"
          >
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-600" />

            <div className="flex items-center justify-between">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
                {phase.period}
              </span>

              <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                Phase 0{index + 1}
              </span>
            </div>

            <h3 className="mt-6 text-2xl font-black leading-tight text-slate-950">
              {phase.title}
            </h3>

            <p className="mt-5 leading-8 text-slate-600">
              {phase.description}
            </p>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                Expected Outcome
              </p>

              <p className="mt-3 text-lg font-black text-slate-950">
                {phase.outcome}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}