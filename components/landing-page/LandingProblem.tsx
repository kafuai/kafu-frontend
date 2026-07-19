const ENTERPRISE_PROBLEMS = [
  {
    title: "معرفة مؤسسية متفرقة",
    description:
      "البيانات والقرارات والخبرات موزعة بين الإدارات والأنظمة والأفراد.",
  },
  {
    title: "قرارات بطيئة وغير مترابطة",
    description:
      "يصعب على القيادة تحويل المعلومات المتعددة إلى أولويات واضحة وسريعة.",
  },
  {
    title: "فجوة بين القرار والتنفيذ",
    description:
      "التوصيات لا ترتبط دائمًا بمسؤوليات ومواعيد ومؤشرات متابعة حقيقية.",
  },
] as const;

export function LandingProblem() {
  return (
    <section className="border-b border-[var(--landing-border)] bg-[var(--landing-bg-primary)] px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--landing-accent)] sm:text-sm">
            The Enterprise Challenge
          </p>

          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[var(--landing-text-primary)] sm:text-4xl lg:text-[2.75rem]">
            المؤسسات لا تعاني من نقص البيانات، بل من صعوبة تحويلها إلى قرار
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--landing-text-secondary)] sm:text-lg">
            عندما تنفصل المعرفة عن القرار، وينفصل القرار عن التنفيذ، تفقد
            المؤسسة السرعة والوضوح والقدرة على تحقيق نتائج مستدامة.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {ENTERPRISE_PROBLEMS.map((problem, index) => (
            <article
              key={problem.title}
              className="min-h-56 rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-6 transition duration-200 hover:border-[var(--landing-border-strong)] hover:bg-[var(--landing-surface-hover)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--landing-border)] bg-[var(--landing-surface-muted)] text-xs font-semibold text-[var(--landing-accent-strong)]">
                {String(index + 1).padStart(2, "0")}
              </div>

              <h3 className="mt-5 text-lg font-semibold leading-7 text-[var(--landing-text-primary)]">
                {problem.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-[var(--landing-text-secondary)] sm:text-base">
                {problem.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

