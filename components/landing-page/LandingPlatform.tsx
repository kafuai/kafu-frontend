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
    <section className="border-b border-white/10 bg-slate-900 px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="lg:sticky lg:top-10 lg:self-start">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              One Connected Platform
            </p>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              من فهم المؤسسة إلى تنفيذ القرار
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              يربط KAFU AI دورة العمل كاملة، بدلًا من ترك كل مرحلة في أداة
              أو ملف أو إدارة منفصلة.
            </p>

            <div className="mt-8 rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.07] p-6">
              <p className="text-sm font-semibold text-cyan-200">
                Connected Intelligence Loop
              </p>

              <p className="mt-3 leading-7 text-slate-300">
                Discover → Assess → Understand → Recommend → Execute → Learn
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {PLATFORM_CAPABILITIES.map((capability, index) => (
              <article
                key={capability.label}
                className="rounded-3xl border border-white/10 bg-slate-950/70 p-7"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-cyan-300">
                    {capability.label}
                  </p>

                  <span className="text-xs font-medium text-slate-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-semibold text-white">
                  {capability.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-400">
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
