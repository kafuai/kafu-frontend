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
    <section className="border-b border-white/10 bg-slate-900 px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950 p-7 sm:p-10 lg:p-14">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Business Outcomes
              </p>

              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                نتائج يمكن للقيادة رؤيتها وقياسها
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-400">
                يبدأ كل تطبيق لـ KAFU AI بتحدٍ مؤسسي واضح ومؤشرات نجاح
                متفق عليها، ثم يقاس الأثر طوال رحلة التنفيذ.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {BUSINESS_OUTCOMES.map((outcome) => (
                <article
                  key={outcome.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-7"
                >
                  <p className="text-3xl font-semibold text-cyan-200">
                    {outcome.value}
                  </p>

                  <h3 className="mt-3 text-lg font-semibold text-white">
                    {outcome.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-400">
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
