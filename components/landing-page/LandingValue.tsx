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
    <section className="border-b border-white/10 bg-slate-900 px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Why KAFU AI
            </p>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
              نظام تشغيل ذكي للمعرفة والقرار والتنفيذ
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              KAFU AI لا يقدم لوحة معلومات إضافية. بل يبني طبقة ذكاء مؤسسي
              تساعد القيادة والفرق على فهم الواقع، تحديد الأولويات، وتنفيذ
              القرارات بثقة.
            </p>
          </div>

          <div className="space-y-5">
            {VALUE_PILLARS.map((pillar) => (
              <article
                key={pillar.eyebrow}
                className="rounded-3xl border border-white/10 bg-slate-950/70 p-7"
              >
                <p className="text-sm font-semibold text-cyan-300">
                  {pillar.eyebrow}
                </p>

                <h3 className="mt-2 text-2xl font-semibold text-white">
                  {pillar.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-400">
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
