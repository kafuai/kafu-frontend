const COMMERCIAL_MODELS = [
  {
    phase: "01",
    label: "Executive Discovery",
    title: "الاكتشاف التنفيذي",
    duration: "1–2 Weeks",
    description:
      "فهم التحدي، أصحاب العلاقة، السياق التشغيلي، الأولويات، والنتائج المطلوبة.",
    deliverables: [
      "Executive discovery sessions",
      "Current-state assessment",
      "Priority challenge definition",
      "Pilot scope recommendation",
      "Success criteria",
    ],
  },
  {
    phase: "02",
    label: "Enterprise Pilot",
    title: "التجربة المؤسسية",
    duration: "3–6 Weeks",
    description:
      "تشغيل KAFU AI على نطاق محدد لإثبات القيمة وتحويل التحدي إلى قرار وتنفيذ.",
    deliverables: [
      "Configured pilot workspace",
      "Enterprise assessment",
      "AI recommendations",
      "Execution roadmap",
      "Executive results review",
    ],
  },
  {
    phase: "03",
    label: "Enterprise Deployment",
    title: "النشر المؤسسي",
    duration: "Custom",
    description:
      "توسيع المنصة لتشمل إدارات وحالات استخدام وتكاملات إضافية داخل المؤسسة.",
    deliverables: [
      "Deployment roadmap",
      "Multi-team rollout",
      "System integrations",
      "Governance model",
      "Training and adoption",
    ],
  },
  {
    phase: "04",
    label: "Continuous Partnership",
    title: "الشراكة المستمرة",
    duration: "Ongoing",
    description:
      "تحسين مستمر للمنصة وحالات الاستخدام والنتائج بناءً على احتياجات المؤسسة.",
    deliverables: [
      "Continuous optimization",
      "Quarterly executive reviews",
      "New use-case expansion",
      "Adoption monitoring",
      "Strategic support",
    ],
  },
] as const;

export function CommercialModels() {
  return (
    <section className="border-b border-white/10 bg-slate-900 px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Engagement Journey
          </p>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            نموذج تجاري يتدرج مع احتياج المؤسسة
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            لا نطلب من العميل الالتزام بنشر كامل منذ اليوم الأول. نبدأ بنطاق
            واضح، نقيس القيمة، ثم نبني قرار التوسع على نتائج فعلية.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {COMMERCIAL_MODELS.map((model) => (
            <article
              key={model.phase}
              className="rounded-[2rem] border border-white/10 bg-slate-950 p-7"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-sm font-semibold text-cyan-300">
                    {model.label}
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    {model.title}
                  </h3>
                </div>

                <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-300">
                  {model.duration}
                </span>
              </div>

              <p className="mt-5 leading-7 text-slate-400">
                {model.description}
              </p>

              <ul className="mt-7 space-y-3 border-t border-white/10 pt-6">
                {model.deliverables.map((deliverable) => (
                  <li
                    key={deliverable}
                    className="flex items-start gap-3 text-sm text-slate-300"
                  >
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />
                    <span>{deliverable}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
