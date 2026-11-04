import {
  ArrowLeft,
  CheckCircle2,
  Compass,
  Network,
  Rocket,
  Sparkles,
} from "lucide-react";

const COMMERCIAL_MODELS = [
  {
    phase: "01",
    label: "Executive Discovery",
    title: "الاكتشاف التنفيذي",
    duration: "1–2 أسبوع",
    description:
      "فهم التحدي المؤسسي، أصحاب العلاقة، السياق التشغيلي، الأولويات، والنتائج المطلوب تحقيقها.",
    deliverables: [
      "جلسات اكتشاف تنفيذية",
      "تقييم الوضع الحالي",
      "تحديد التحدي ذي الأولوية",
      "توصية بنطاق التجربة",
      "معايير نجاح واضحة",
    ],
    icon: Compass,
  },
  {
    phase: "02",
    label: "Enterprise Pilot",
    title: "التجربة المؤسسية",
    duration: "3–6 أسابيع",
    description:
      "تشغيل KAFU AI على نطاق محدد لإثبات القيمة وتحويل التحدي إلى قرارات وخطوات تنفيذية قابلة للقياس.",
    deliverables: [
      "مساحة عمل Pilot مهيأة",
      "تقييم مؤسسي متكامل",
      "توصيات مدعومة بالذكاء الاصطناعي",
      "خارطة طريق تنفيذية",
      "مراجعة تنفيذية للنتائج",
    ],
    icon: Rocket,
  },
  {
    phase: "03",
    label: "Enterprise Deployment",
    title: "النشر المؤسسي",
    duration: "حسب النطاق",
    description:
      "توسيع المنصة لتشمل إدارات وحالات استخدام وتكاملات إضافية داخل المؤسسة وفق خطة نشر مرحلية.",
    deliverables: [
      "خارطة طريق للنشر",
      "توسع متعدد الإدارات",
      "تكاملات الأنظمة",
      "نموذج حوكمة",
      "التدريب وتبني الاستخدام",
    ],
    icon: Network,
  },
  {
    phase: "04",
    label: "Continuous Partnership",
    title: "الشراكة المستمرة",
    duration: "مستمر",
    description:
      "تحسين مستمر للمنصة وحالات الاستخدام والنتائج بناءً على أولويات المؤسسة وتطور احتياجاتها.",
    deliverables: [
      "تحسين مستمر",
      "مراجعات تنفيذية ربع سنوية",
      "توسيع حالات الاستخدام",
      "متابعة التبني",
      "دعم استراتيجي مستمر",
    ],
    icon: Sparkles,
  },
] as const;

export function CommercialModels() {
  return (
    <section
      className="relative overflow-hidden border-b border-white/10 bg-slate-900 px-4 py-20 sm:px-6 lg:px-10 lg:py-28"
      dir="rtl"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.06),transparent_45%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2">
              <Sparkles size={15} className="text-cyan-300" />

              <span className="text-xs font-black tracking-wide text-cyan-200">
                Engagement Journey
              </span>
            </div>

            <h2 className="mt-6 text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
              نموذج تجاري يتدرج
              <span className="block text-cyan-300">
                مع احتياج المؤسسة ونتائجها
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              لا نطلب من العميل الالتزام بنشر كامل منذ اليوم الأول. نبدأ بنطاق
              واضح، نقيس القيمة، ثم نبني قرار التوسع على نتائج فعلية وموثوقة.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
            <p className="text-xs font-black text-slate-500">
              النموذج التجاري
            </p>

            <p className="mt-2 text-sm font-black text-white">
              اكتشاف ← تجربة ← نشر ← شراكة
            </p>
          </div>
        </div>

        <div className="relative mt-16">
          <div className="absolute bottom-0 right-8 top-0 hidden w-px bg-gradient-to-b from-cyan-300/50 via-cyan-300/20 to-transparent lg:block" />

          <div className="grid gap-6 lg:grid-cols-2">
            {COMMERCIAL_MODELS.map((model) => {
              const Icon = model.icon;

              return (
                <article
                  key={model.phase}
                  className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-slate-950 sm:p-8"
                >
                  <div className="absolute left-0 top-0 h-32 w-32 rounded-full bg-cyan-300/5 blur-3xl transition group-hover:bg-cyan-300/10" />

                  <div className="relative">
                    <div className="flex items-start justify-between gap-5">
                      <div className="flex items-start gap-4">
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/10 text-cyan-300">
                          <Icon size={24} />
                        </span>

                        <div>
                          <p className="text-xs font-black tracking-wide text-cyan-300">
                            {model.label}
                          </p>

                          <h3 className="mt-2 text-2xl font-black text-white">
                            {model.title}
                          </h3>
                        </div>
                      </div>

                      <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-black text-slate-300">
                        {model.duration}
                      </span>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                      <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-white text-sm font-black text-slate-950">
                        {model.phase}
                      </span>

                      <div className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent" />
                    </div>

                    <p className="mt-6 text-sm leading-8 text-slate-400">
                      {model.description}
                    </p>

                    <div className="mt-7 border-t border-white/10 pt-6">
                      <p className="text-xs font-black text-slate-500">
                        المخرجات الرئيسية
                      </p>

                      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                        {model.deliverables.map((deliverable) => (
                          <li
                            key={deliverable}
                            className="flex items-start gap-3 rounded-xl bg-white/[0.03] p-3 text-sm leading-6 text-slate-300"
                          >
                            <CheckCircle2
                              size={17}
                              className="mt-0.5 shrink-0 text-emerald-400"
                            />

                            <span>{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-7 flex items-center gap-2 text-xs font-black text-cyan-300 opacity-70 transition group-hover:opacity-100">
                      <span>مرحلة مترابطة ضمن رحلة التحول</span>
                      <ArrowLeft size={15} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}