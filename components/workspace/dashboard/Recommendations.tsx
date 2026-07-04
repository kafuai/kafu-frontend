export default function Recommendations() {
  const recommendations = [
    {
      title: "تقليل زمن الموافقات",
      desc: "اقتراح بتبسيط مسار الموافقات الداخلية لتسريع إنجاز طلبات الموظفين.",
      impact: "High Impact",
    },
    {
      title: "تحسين تجربة الموظف",
      desc: "إضافة مسار واضح للاستفسارات المتكررة وربطه بالمساعد الذكي.",
      impact: "Medium Impact",
    },
    {
      title: "مراجعة المخاطر التشغيلية",
      desc: "تحديد المخاطر ذات التأثير العالي وربطها بخطة متابعة أسبوعية.",
      impact: "Priority",
    },
  ];

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-900">
          التوصيات الذكية
        </h2>

        <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white">
          AI
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {recommendations.map((item) => (
          <div key={item.title} className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-bold text-slate-900">{item.title}</h3>

              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500">
                {item.impact}
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}