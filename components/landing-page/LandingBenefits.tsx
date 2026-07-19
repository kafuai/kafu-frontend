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
    <section className="border-b border-[var(--landing-border)] bg-[var(--landing-bg-primary)] px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--landing-accent)] sm:text-sm">
            Executive Benefits
          </p>

          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[var(--landing-text-primary)] sm:text-4xl lg:text-[2.75rem]">
            قيمة مباشرة للقيادة والمؤسسة
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--landing-text-secondary)] sm:text-lg">
            لا يقاس نجاح KAFU AI بعدد التقارير التي ينتجها، بل بقدرته على
            تحسين سرعة القرار وجودة التنفيذ والنتائج المؤسسية.
          </p>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-grid-divider)] md:grid-cols-2 lg:grid-cols-3">
          {EXECUTIVE_BENEFITS.map((benefit) => (
            <article
              key={benefit.title}
              className="min-h-52 bg-[var(--landing-bg-primary)] p-6 transition duration-200 hover:bg-[var(--landing-bg-secondary)]"
            >
              <p className="text-xs font-semibold text-[var(--landing-accent)]">
                {benefit.metric}
              </p>

              <h3 className="mt-4 text-lg font-semibold leading-7 text-[var(--landing-text-primary)]">
                {benefit.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-[var(--landing-text-secondary)] sm:text-base">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

