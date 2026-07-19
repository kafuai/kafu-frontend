const BUSINESS_OUTCOMES = [
  {
    value: "أسرع",
    title: "دورة القرار",
    description:
      "تقليل الوقت المستغرق في جمع المعلومات وتوحيدها وتحويلها إلى اتجاه تنفيذي.",
  },
  {
    value: "أوضح",
    title: "المساءلة والتنفيذ",
    description:
      "تحديد من يملك القرار، وما المطلوب، ومتى يجب التنفيذ، وكيف تقاس النتيجة.",
  },
  {
    value: "أذكى",
    title: "استخدام المعرفة",
    description:
      "الاستفادة من سياق المؤسسة وقراراتها وتجاربها السابقة بدل البدء من الصفر.",
  },
  {
    value: "أقوى",
    title: "جاهزية المؤسسة",
    description:
      "كشف الفجوات والمخاطر مبكرًا وبناء خطط تحول أكثر واقعية واستدامة.",
  },
] as const;

export function LandingOutcomes() {
  return (
    <section className="border-b border-[var(--landing-border)] bg-[var(--landing-bg-secondary)] px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-[var(--landing-border)] bg-[var(--landing-bg-primary)] p-6 sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-12">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--landing-accent)] sm:text-sm">
                Business Outcomes
              </p>

              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[var(--landing-text-primary)] sm:text-4xl lg:text-[2.75rem]">
                نتائج يمكن للقيادة رؤيتها وقياسها
              </h2>

              <p className="mt-5 text-base leading-8 text-[var(--landing-text-secondary)] sm:text-lg">
                يبدأ كل تطبيق لـ KAFU AI بتحدٍ مؤسسي واضح ومؤشرات نجاح متفق
                عليها، ثم يقاس الأثر طوال رحلة التنفيذ.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {BUSINESS_OUTCOMES.map((outcome) => (
                <article
                  key={outcome.title}
                  className="min-h-52 rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-6 transition duration-200 hover:border-[var(--landing-accent-border)] hover:bg-[var(--landing-surface-hover)]"
                >
                  <p className="text-2xl font-semibold tracking-tight text-[var(--landing-accent-strong)]">
                    {outcome.value}
                  </p>

                  <h3 className="mt-3 text-lg font-semibold leading-7 text-[var(--landing-text-primary)]">
                    {outcome.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[var(--landing-text-secondary)] sm:text-base">
                    {outcome.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

