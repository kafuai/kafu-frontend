type Priority = {
  title: string;
  description: string;
  timeline: string;
};

type StrategicPrioritiesProps = {
  priorities?: Priority[];
};

export default function StrategicPriorities({
  priorities = [
    {
      title: "بناء Corporate DNA",
      description:
        "تحويل بيانات الشركة وإجابات الاستكشاف إلى هوية تشغيلية قابلة للقياس والتحليل.",
      timeline: "Immediate",
    },
    {
      title: "تأسيس Corporate Brain",
      description:
        "إنشاء طبقة معرفة داخلية تساعد KAFU AI على فهم الشركة، سياساتها، عملياتها، وقراراتها.",
      timeline: "Next",
    },
    {
      title: "تفعيل Digital Workforce",
      description:
        "بناء وكلاء ذكاء اصطناعي متخصصين لدعم الموظفين والإدارة في العمليات اليومية.",
      timeline: "90 Days",
    },
  ],
}: StrategicPrioritiesProps) {
  return (
    <section className="h-full rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="border-b border-slate-200 pb-7">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600">
          Strategic Priorities
        </p>

        <h2 className="mt-4 text-3xl font-black leading-tight text-slate-950 md:text-4xl">
          الأولويات التنفيذية المقترحة
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          خارطة أولويات مركزة تساعد الإدارة العليا على تحويل الرؤى إلى قرارات
          ومبادرات قابلة للتنفيذ.
        </p>
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-3 xl:grid-cols-1">
        {priorities.map((priority, index) => (
          <article
            key={priority.title}
            className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm"
          >
            <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-500 to-sky-500" />

            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">
                Priority 0{index + 1}
              </p>

              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-slate-600">
                {priority.timeline}
              </span>
            </div>

            <h3 className="mt-5 text-xl font-black leading-8 text-slate-950">
              {priority.title}
            </h3>

            <p className="mt-4 leading-8 text-slate-600">
              {priority.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}