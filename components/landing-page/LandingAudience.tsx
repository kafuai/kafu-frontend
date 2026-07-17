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
    <section className="border-b border-white/10 bg-slate-950 px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Built for Enterprise Leaders
          </p>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            منصة واحدة تجمع القيادة والفرق حول صورة مؤسسية موحدة
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            صُمم KAFU AI ليدعم من يصنع القرار، ومن يترجم القرار إلى خطط،
            ومن يقود التنفيذ داخل المؤسسة.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {TARGET_AUDIENCES.map((audience, index) => (
            <article
              key={audience.title}
              className="group rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.06]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-sm font-semibold text-cyan-200">
                {String(index + 1).padStart(2, "0")}
              </div>

              <h3 className="mt-6 text-xl font-semibold text-white">
                {audience.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                {audience.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
