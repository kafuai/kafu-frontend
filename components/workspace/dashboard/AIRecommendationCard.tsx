export default function AIRecommendationCard() {
  const recommendations = [
    "اعتماد لوحة القيادة التنفيذية كواجهة العرض الرئيسية.",
    "إكمال ربط بيانات الديمو مع مؤشرات الأداء.",
    "إظهار التنبيهات الحرجة في أعلى الصفحة.",
    "عرض جاهزية الرواتب ضمن الملخص التنفيذي.",
  ];

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">
        AI Recommendation
      </p>

      <h3 className="mt-2 text-2xl font-black text-slate-950">
        توصيات الذكاء الاصطناعي
      </h3>

      <div className="mt-6 space-y-3">
        {recommendations.map((item) => (
          <div
            key={item}
            className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700"
          >
            • {item}
          </div>
        ))}
      </div>
    </section>
  );
}
