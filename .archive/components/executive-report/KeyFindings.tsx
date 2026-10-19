type Finding = {
  title: string;
  description: string;
  impact: string;
};

type KeyFindingsProps = {
  findings?: Finding[];
};

export default function KeyFindings({
  findings = [
    {
      title: "وضوح أولي في احتياج التحول الذكي",
      description:
        "إجابات الاستكشاف تشير إلى وجود فرصة لبناء طبقة ذكاء مؤسسي تساعد الإدارة على قراءة الواقع التشغيلي بشكل أسرع.",
      impact: "High",
    },
    {
      title: "وجود فرصة لبناء Corporate DNA",
      description:
        "بيانات الشركة والإجابات الحالية تمثل قاعدة أولية يمكن تحويلها إلى هوية تشغيلية قابلة للقياس والتحليل.",
      impact: "High",
    },
    {
      title: "قابلية واضحة لتفعيل Digital Workforce",
      description:
        "بعض العمليات المتكررة يمكن تحويلها لاحقًا إلى وكلاء أذكياء يعملون بجانب الفريق البشري.",
      impact: "Medium",
    },
  ],
}: KeyFindingsProps) {
  return (
    <section className="h-full rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="border-b border-slate-200 pb-7">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600">
          Key Findings
        </p>

        <h2 className="mt-4 text-3xl font-black leading-tight text-slate-950 md:text-4xl">
          أهم ما اكتشفه KAFU AI
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          قراءة مركزة لأبرز المؤشرات التي ظهرت من بيانات الاستكشاف وتحليل
          الجاهزية التنفيذية.
        </p>
      </div>

      <div className="mt-7 space-y-5">
        {findings.map((finding, index) => (
          <article
            key={finding.title}
            className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">
                  Finding 0{index + 1}
                </p>

                <h3 className="mt-3 text-xl font-black leading-8 text-slate-950">
                  {finding.title}
                </h3>
              </div>

              <span className="w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-700">
                Impact: {finding.impact}
              </span>
            </div>

            <p className="mt-5 leading-8 text-slate-600">
              {finding.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}