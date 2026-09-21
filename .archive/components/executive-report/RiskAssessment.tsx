type Risk = {
  title: string;
  description: string;
  level: string;
};

type RiskAssessmentProps = {
  risks?: Risk[];
};

export default function RiskAssessment({
  risks = [
    {
      title: "تشتت المعرفة المؤسسية",
      description:
        "غياب طبقة معرفة موحدة قد يؤدي إلى اعتماد القرارات على خبرات فردية بدل نظام معرفي مؤسسي.",
      level: "Medium",
    },
    {
      title: "بطء تحويل البيانات إلى قرارات",
      description:
        "وجود البيانات دون تحليل تنفيذي سريع قد يقلل من قدرة الإدارة على اتخاذ قرارات دقيقة في الوقت المناسب.",
      level: "High",
    },
    {
      title: "ضعف قابلية التوسع التشغيلي",
      description:
        "بدون Corporate DNA واضح، قد يصبح التوسع معتمدًا على الأشخاص لا على نظام قابل للتكرار.",
      level: "Medium",
    },
  ],
}: RiskAssessmentProps) {
  return (
    <section className="h-full rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="border-b border-slate-200 pb-7">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-600">
          Risk Assessment
        </p>

        <h2 className="mt-4 text-3xl font-black leading-tight text-slate-950 md:text-4xl">
          المخاطر التنفيذية المحتملة
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          قراءة مبكرة للمخاطر التي قد تؤثر على سرعة القرار، استدامة المعرفة،
          وقابلية التوسع التشغيلي.
        </p>
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-3 xl:grid-cols-1">
        {risks.map((risk, index) => (
          <article
            key={risk.title}
            className="relative overflow-hidden rounded-[1.75rem] border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm"
          >
            <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-amber-500 to-orange-500" />

            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-700">
                Risk 0{index + 1}
              </p>

              <span className="rounded-full border border-amber-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-amber-700">
                {risk.level}
              </span>
            </div>

            <h3 className="mt-5 text-xl font-black leading-8 text-slate-950">
              {risk.title}
            </h3>

            <p className="mt-4 leading-8 text-slate-700">
              {risk.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}