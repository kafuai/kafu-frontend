const PILOT_INCLUDED = [
  "تحديد تحدٍ مؤسسي واحد عالي الأولوية",
  "جلسات اكتشاف مع أصحاب العلاقة",
  "إعداد مساحة KAFU AI التجريبية",
  "تقييم مؤسسي وتحليل فجوات",
  "توصيات تنفيذية مدعومة بالذكاء الاصطناعي",
  "خريطة أولويات ومسؤوليات ومواعيد",
  "مراجعة تنفيذية نهائية للنتائج",
  "توصية واضحة بالتوسع أو التعديل",
] as const;

const PILOT_SUCCESS = [
  "تحسين وضوح المشكلة والأولويات",
  "تقليل زمن جمع وتحليل المعلومات",
  "إنتاج قرار أو توصية قابلة للتنفيذ",
  "تحديد المسؤوليات ومؤشرات المتابعة",
  "إثبات قيمة واضحة للقيادة",
] as const;

export function CommercialOffer() {
  return (
    <section className="border-b border-white/10 bg-slate-950 px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[2rem] border border-cyan-300/25 bg-[linear-gradient(135deg,rgba(15,23,42,1),rgba(2,6,23,1))]">
          <div className="grid gap-px bg-white/10 lg:grid-cols-2">
            <div className="bg-slate-950 p-8 sm:p-12">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Enterprise Pilot Offer
              </p>

              <h2 className="mt-5 text-3xl font-semibold text-white sm:text-5xl">
                العرض الموصى به لأول عميل
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-400">
                Pilot مركز على تحدٍ مؤسسي حقيقي، بنتائج ومؤشرات نجاح قابلة
                للعرض أمام الإدارة التنفيذية.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full bg-white/[0.06] px-4 py-2 text-sm text-slate-300">
                  3–6 Weeks
                </span>
                <span className="rounded-full bg-white/[0.06] px-4 py-2 text-sm text-slate-300">
                  Focused Scope
                </span>
                <span className="rounded-full bg-white/[0.06] px-4 py-2 text-sm text-slate-300">
                  Executive Review
                </span>
              </div>

              <h3 className="mt-10 text-lg font-semibold text-white">
                يشمل العرض
              </h3>

              <ul className="mt-5 space-y-4">
                {PILOT_INCLUDED.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-slate-300"
                  >
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 p-8 sm:p-12">
              <p className="text-sm font-semibold text-cyan-300">
                Success Measurement
              </p>

              <h3 className="mt-4 text-3xl font-semibold text-white">
                كيف نقيس نجاح الـ Pilot؟
              </h3>

              <p className="mt-5 leading-7 text-slate-400">
                يتم الاتفاق على مؤشرات النجاح قبل البدء حتى يكون قرار التوسع
                مبنيًا على نتائج واضحة، وليس الانطباعات.
              </p>

              <div className="mt-8 space-y-4">
                {PILOT_SUCCESS.map((item, index) => (
                  <div
                    key={item}
                    className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                  >
                    <span className="text-sm font-semibold text-cyan-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <p className="text-slate-300">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.07] p-6">
                <p className="text-sm font-semibold text-cyan-200">
                  Pricing Approach
                </p>

                <p className="mt-3 leading-7 text-slate-300">
                  يتم إعداد العرض المالي حسب نطاق الـ Pilot، عدد أصحاب العلاقة،
                  حجم البيانات، التكاملات المطلوبة، ومستوى الدعم التنفيذي.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
