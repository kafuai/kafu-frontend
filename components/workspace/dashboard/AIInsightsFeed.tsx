export default function AIInsightsFeed() {
  const insights = [
    {
      title: "بطء في دورة الموافقات",
      desc: "قد يؤثر على سرعة إنجاز طلبات الموظفين ورضاهم عن التجربة الداخلية.",
      tag: "Operational",
      priority: "تنبيه",
      tone: "rose",
    },
    {
      title: "فرصة لتحسين تجربة الموظف",
      desc: "إنشاء مسار موحد للأسئلة المتكررة يقلل الضغط على فريق الموارد البشرية.",
      tag: "HR",
      priority: "فرصة",
      tone: "emerald",
    },
    {
      title: "جاهزية إيجابية للذكاء الاصطناعي",
      desc: "الشركة لديها قابلية جيدة لتبني الأتمتة وتحويل الطلبات المتكررة إلى مسارات ذكية.",
      tag: "AI Readiness",
      priority: "قوة",
      tone: "cyan",
    },
  ];

  const tones: Record<string, string> = {
    rose: "bg-rose-50 text-rose-700 border-rose-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-100",
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-black text-cyan-600">AI Insights</p>

          <h2 className="mt-3 text-3xl font-black text-slate-950">
            تحليلات مختصرة
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            أهم الإشارات التي التقطها KAFU AI من مؤشرات الشركة، مختصرة لصانع القرار.
          </p>
        </div>

        <button className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100">
          عرض التحليل الكامل
        </button>
      </div>

      <div className="mt-8 space-y-4">
        {insights.map((item) => (
          <div
            key={item.title}
            className="group rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-md"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-black ${tones[item.tone]}`}
                  >
                    {item.priority}
                  </span>

                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500">
                    {item.tag}
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-black text-slate-950">
                  {item.title}
                </h3>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                  {item.desc}
                </p>
              </div>

              <button className="rounded-2xl bg-white px-4 py-3 text-xs font-black text-slate-700 transition hover:bg-slate-950 hover:text-white">
                مراجعة التوصية
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}