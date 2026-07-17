const EXECUTIVE_BENEFITS = [
  {
    metric: "01",
    title: "وضوح تنفيذي أكبر",
    description:
      "صورة موحدة تربط التحديات والقرارات والمبادرات والنتائج أمام القيادة.",
  },
  {
    metric: "02",
    title: "قرارات أسرع وأكثر ثقة",
    description:
      "توصيات مبنية على السياق المؤسسي والأدلة والأولويات بدل الاجتهادات المنفصلة.",
  },
  {
    metric: "03",
    title: "مساءلة واضحة",
    description:
      "كل قرار يرتبط بمالك، موعد، حالة، ومؤشرات متابعة قابلة للقياس.",
  },
  {
    metric: "04",
    title: "تنسيق أفضل بين الإدارات",
    description:
      "توحيد اللغة والمعلومات والمسؤوليات عبر الفرق والمستويات الإدارية.",
  },
  {
    metric: "05",
    title: "حفظ المعرفة المؤسسية",
    description:
      "تقليل ضياع الخبرة والسياق عند انتقال الموظفين أو تغير الفرق.",
  },
  {
    metric: "06",
    title: "قدرة أكبر على التوسع",
    description:
      "إدخال الذكاء الاصطناعي إلى العمل المؤسسي ضمن إطار منظم وقابل للحوكمة.",
  },
] as const;

export function LandingBenefits() {
  return (
    <section className="border-b border-white/10 bg-slate-950 px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Executive Benefits
          </p>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            قيمة مباشرة للقيادة والمؤسسة
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            لا يقاس نجاح KAFU AI بعدد التقارير التي ينتجها، بل بقدرته على
            تحسين سرعة القرار وجودة التنفيذ والنتائج المؤسسية.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
          {EXECUTIVE_BENEFITS.map((benefit) => (
            <article
              key={benefit.title}
              className="bg-slate-950 p-7 transition hover:bg-slate-900"
            >
              <p className="text-sm font-semibold text-cyan-300">
                {benefit.metric}
              </p>

              <h3 className="mt-5 text-xl font-semibold text-white">
                {benefit.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
