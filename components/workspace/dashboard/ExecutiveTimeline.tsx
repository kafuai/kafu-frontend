export default function ExecutiveTimeline() {
  const timeline = [
    {
      step: "01",
      title: "جمع بيانات الشركة",
      desc: "تم استقبال بيانات الشركة الأساسية من مساحة العمل.",
      status: "Completed",
    },
    {
      step: "02",
      title: "تحليل إجابات Discovery",
      desc: "KAFU AI يقرأ الإجابات ويربطها بمؤشرات الجاهزية.",
      status: "Active",
    },
    {
      step: "03",
      title: "توليد التوصيات",
      desc: "سيتم تحويل المخاطر والفرص إلى توصيات تنفيذية.",
      status: "Next",
    },
  ];

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-bold text-slate-500">Executive Timeline</p>

      <h2 className="mt-1 text-2xl font-black text-slate-950">
        مسار التحليل التنفيذي
      </h2>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {timeline.map((item) => (
          <div key={item.step} className="rounded-2xl bg-slate-50 p-5">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">
                {item.step}
              </span>

              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500">
                {item.status}
              </span>
            </div>

            <h3 className="mt-5 font-black text-slate-950">{item.title}</h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}