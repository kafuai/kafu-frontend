const FAQ_ITEMS = [
  {
    question: "ما هو KAFU AI؟",
    answer:
      "منصة ذكاء مؤسسي وتنفيذ تساعد القيادة على فهم المؤسسة، اتخاذ قرارات أوضح، وربط التوصيات بالتنفيذ والمتابعة.",
  },
  {
    question: "هل KAFU AI نظام موارد بشرية؟",
    answer:
      "لا. يمكنه دعم تحديات الموارد البشرية والتوطين، لكنه مصمم كمنصة أوسع للمعرفة والقرار والتنفيذ المؤسسي.",
  },
  {
    question: "كيف تبدأ المؤسسة؟",
    answer:
      "نبدأ عادةً بـ Pilot محدود النطاق يركز على تحدٍ حقيقي ومؤشرات نجاح واضحة خلال مدة تتراوح غالبًا بين 3 و6 أسابيع.",
  },
  {
    question: "هل يمكن ربطه بأنظمة المؤسسة؟",
    answer:
      "نعم. يتم تحديد التكاملات المطلوبة بناءً على نطاق الاستخدام والبيانات والأنظمة الحالية داخل المؤسسة.",
  },
  {
    question: "هل يمكن استخدامه من أكثر من إدارة؟",
    answer:
      "نعم. تم تصميمه ليجمع القيادة وفرق التحول والموارد البشرية والإدارات التشغيلية حول سياق مؤسسي موحد.",
  },
] as const;

export function LandingFAQ() {
  return (
    <section className="border-b border-white/10 bg-slate-950 px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Frequently Asked Questions
          </p>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            أسئلة شائعة
          </h2>
        </div>

        <div className="mt-12 divide-y divide-white/10 rounded-3xl border border-white/10 bg-white/[0.03] px-6 sm:px-8">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold text-white">
                <span>{item.question}</span>
                <span className="text-cyan-300 transition group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 max-w-3xl leading-7 text-slate-400">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
