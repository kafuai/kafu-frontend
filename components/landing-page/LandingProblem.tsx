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
    <section className="border-b border-white/10 bg-slate-950 px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            The Enterprise Challenge
          </p>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
            المؤسسات لا تعاني من نقص البيانات، بل من صعوبة تحويلها إلى قرار
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            عندما تنفصل المعرفة عن القرار، وينفصل القرار عن التنفيذ، تفقد
            المؤسسة السرعة والوضوح والقدرة على تحقيق نتائج مستدامة.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {ENTERPRISE_PROBLEMS.map((problem, index) => (
            <article
              key={problem.title}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-7"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-sm font-semibold text-cyan-200">
                {String(index + 1).padStart(2, "0")}
              </div>

              <h3 className="mt-6 text-xl font-semibold text-white">
                {problem.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                {problem.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
