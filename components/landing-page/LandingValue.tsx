const VALUE_PILLARS = [
  {
    eyebrow: "Understand",
    title: "افهم مؤسستك بعمق",
    description:
      "اجمع السياق المؤسسي، التحديات، القدرات، الأولويات، والمخاطر في صورة واحدة مترابطة.",
  },
  {
    eyebrow: "Decide",
    title: "اتخذ قرارات أوضح",
    description:
      "حوّل البيانات والتقييمات إلى توصيات تنفيذية مرتبة حسب الأولوية والأثر والثقة.",
  },
  {
    eyebrow: "Execute",
    title: "اربط القرار بالتنفيذ",
    description:
      "حوّل التوصيات إلى مبادرات ومسؤوليات ومواعيد ومتابعة مستمرة من مركز قيادة موحد.",
  },
] as const;

export function LandingValue() {
  return (
    <section className="border-b border-[var(--landing-border)] bg-[var(--landing-bg-secondary)] px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--landing-accent)] sm:text-sm">
              Why KAFU AI
            </p>

            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[var(--landing-text-primary)] sm:text-4xl lg:text-[2.75rem]">
              نظام تشغيل ذكي للمعرفة والقرار والتنفيذ
            </h2>

            <p className="mt-5 text-base leading-8 text-[var(--landing-text-secondary)] sm:text-lg">
              KAFU AI لا يقدم لوحة معلومات إضافية، بل يبني طبقة ذكاء مؤسسي
              تساعد القيادة والفرق على فهم الواقع، تحديد الأولويات، وتنفيذ
              القرارات بثقة.
            </p>
          </div>

          <div className="space-y-4">
            {VALUE_PILLARS.map((pillar, index) => (
              <article
                key={pillar.eyebrow}
                className="rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-6 transition duration-200 hover:border-[var(--landing-accent-border)] hover:bg-[var(--landing-surface-hover)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--landing-accent)]">
                    {pillar.eyebrow}
                  </p>

                  <span className="text-xs font-medium text-[var(--landing-text-muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-3 text-xl font-semibold leading-7 text-[var(--landing-text-primary)]">
                  {pillar.title}
                </h3>

                <p className="mt-2 text-sm leading-7 text-[var(--landing-text-secondary)] sm:text-base">
                  {pillar.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

