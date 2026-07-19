const TARGET_AUDIENCES = [
  {
    title: "القيادات التنفيذية",
    description:
      "رؤية موحدة للأداء المؤسسي، الأولويات، المخاطر، والقرارات التي تحتاج إلى تدخل.",
  },
  {
    title: "فرق التحول والاستراتيجية",
    description:
      "ربط المبادرات بالأهداف، وتحديد فجوات التنفيذ، وقياس التقدم والنتائج.",
  },
  {
    title: "الموارد البشرية والتوطين",
    description:
      "تحليل القدرات، فجوات القوى العاملة، الاحتياجات المستقبلية، وخطط التطوير.",
  },
  {
    title: "الإدارات التشغيلية",
    description:
      "تحويل التحديات اليومية إلى إجراءات واضحة ومسؤوليات ومؤشرات متابعة.",
  },
] as const;

export function LandingAudience() {
  return (
    <section className="border-b border-[var(--landing-border)] bg-[var(--landing-bg-primary)] px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--landing-accent)] sm:text-sm">
            Built for Enterprise Leaders
          </p>

          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[var(--landing-text-primary)] sm:text-4xl lg:text-[2.75rem]">
            منصة واحدة تجمع القيادة والفرق حول صورة مؤسسية موحدة
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--landing-text-secondary)] sm:text-lg">
            صُمم KAFU AI ليدعم من يصنع القرار، ومن يترجم القرار إلى خطط،
            ومن يقود التنفيذ داخل المؤسسة.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {TARGET_AUDIENCES.map((audience, index) => (
            <article
              key={audience.title}
              className="group flex min-h-60 flex-col rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-6 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--landing-accent-border)] hover:bg-[var(--landing-surface-hover)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--landing-accent-border)] bg-[var(--landing-accent-soft)] text-xs font-semibold text-[var(--landing-accent-strong)]">
                {String(index + 1).padStart(2, "0")}
              </div>

              <h3 className="mt-5 text-lg font-semibold leading-7 text-[var(--landing-text-primary)]">
                {audience.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-[var(--landing-text-secondary)] sm:text-base">
                {audience.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

