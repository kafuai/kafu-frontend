const PLATFORM_CAPABILITIES = [
  {
    label: "Discover",
    title: "الاكتشاف المؤسسي",
    description:
      "التقاط السياق الحقيقي للمؤسسة من خلال أسئلة موجهة، بيانات تشغيلية، ومدخلات أصحاب العلاقة.",
  },
  {
    label: "Assess",
    title: "التقييم والجاهزية",
    description:
      "قياس الجاهزية المؤسسية، القدرات، فجوات الأداء، والمخاطر التي تعيق التقدم.",
  },
  {
    label: "Understand",
    title: "العقل المؤسسي",
    description:
      "بناء ذاكرة مترابطة للمعرفة والقرارات والأولويات والتجارب السابقة داخل المؤسسة.",
  },
  {
    label: "Recommend",
    title: "التوصيات الذكية",
    description:
      "تحويل المعطيات إلى توصيات تنفيذية مرتبة حسب الأولوية، الأثر، والثقة.",
  },
  {
    label: "Execute",
    title: "مركز القيادة",
    description:
      "إدارة القرارات، المبادرات، المسؤوليات، المواعيد، والتنبيهات من مساحة موحدة.",
  },
  {
    label: "Scale",
    title: "القوى العاملة الرقمية",
    description:
      "توظيف وكلاء ذكاء اصطناعي لدعم الفرق في التحليل، المتابعة، والتنسيق المؤسسي.",
  },
] as const;

export function LandingPlatform() {
  return (
    <section className="border-b border-[var(--landing-border)] bg-[var(--landing-bg-secondary)] px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--landing-accent)] sm:text-sm">
              One Connected Platform
            </p>

            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[var(--landing-text-primary)] sm:text-4xl lg:text-[2.75rem]">
              من فهم المؤسسة إلى تنفيذ القرار
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-[var(--landing-text-secondary)] sm:text-lg">
              يربط KAFU AI دورة العمل كاملة بدلًا من ترك كل مرحلة في أداة أو
              ملف أو إدارة منفصلة.
            </p>

            <div className="mt-7 rounded-2xl border border-[var(--landing-accent-border)] bg-[var(--landing-accent-soft)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--landing-accent-strong)]">
                Connected Intelligence Loop
              </p>

              <p
                dir="ltr"
                className="mt-3 text-left text-sm leading-7 text-[var(--landing-text-secondary)] sm:text-base"
              >
                Discover → Assess → Understand → Recommend → Execute → Learn
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {PLATFORM_CAPABILITIES.map((capability, index) => (
              <article
                key={capability.label}
                className="min-h-56 rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-6 transition duration-200 hover:border-[var(--landing-accent-border)] hover:bg-[var(--landing-surface-hover)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--landing-accent)]">
                    {capability.label}
                  </p>

                  <span className="text-xs font-medium text-[var(--landing-text-muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-semibold leading-7 text-[var(--landing-text-primary)]">
                  {capability.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[var(--landing-text-secondary)] sm:text-base">
                  {capability.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

