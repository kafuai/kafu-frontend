const PILOT_STEPS = [
  {
    step: "01",
    title: "تحديد التحدي",
    description:
      "نختار تحديًا مؤسسيًا واضحًا له أثر تنفيذي ويمكن قياس نتائجه.",
  },
  {
    step: "02",
    title: "جمع السياق",
    description:
      "نربط أصحاب العلاقة والبيانات والأولويات اللازمة لفهم الوضع الحالي.",
  },
  {
    step: "03",
    title: "تشغيل KAFU AI",
    description:
      "نحوّل المعطيات إلى تقييمات وتوصيات وخطة تنفيذية قابلة للمتابعة.",
  },
  {
    step: "04",
    title: "قياس الأثر",
    description:
      "نراجع النتائج مع القيادة ونحدد قرار التوسع أو المرحلة التالية.",
  },
] as const;

export function LandingPilot() {
  return (
    <section className="border-b border-white/10 bg-slate-950 px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Controlled Enterprise Pilot
            </p>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              ابدأ بتجربة تنفيذية واضحة خلال 3–6 أسابيع
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              يبدأ Pilot بنطاق محدد ومؤشرات نجاح متفق عليها، حتى تتمكن
              القيادة من تقييم القيمة قبل التوسع.
            </p>

            <div className="mt-8 rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.07] p-6">
              <p className="text-sm font-semibold text-cyan-200">
                Pilot Success Criteria
              </p>

              <p className="mt-3 leading-7 text-slate-300">
                وضوح أعلى، قرار أسرع، مسؤوليات محددة، ومتابعة تنفيذية قابلة
                للقياس.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {PILOT_STEPS.map((item) => (
              <article
                key={item.step}
                className="flex gap-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold text-cyan-200">
                  {item.step}
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
