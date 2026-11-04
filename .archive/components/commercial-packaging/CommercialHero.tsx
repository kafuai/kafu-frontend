import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Layers3,
  Sparkles,
  Target,
} from "lucide-react";

const pilotMetrics = [
  {
    label: "المدة المتوقعة",
    value: "3–6 أسابيع",
    icon: Clock3,
  },
  {
    label: "الهدف الأساسي",
    value: "إثبات القيمة",
    icon: Target,
  },
  {
    label: "نطاق التنفيذ",
    value: "محدد وواضح",
    icon: Layers3,
  },
  {
    label: "النتيجة النهائية",
    value: "قرار التوسع",
    icon: CheckCircle2,
  },
];

const engagementBenefits = [
  "تحدٍ مؤسسي حقيقي ومحدد",
  "مؤشرات نجاح قابلة للقياس",
  "نطاق زمني وتنفيذي واضح",
];

export function CommercialHero() {
  return (
    <section
      className="relative overflow-hidden border-b border-white/10 px-4 py-20 sm:px-6 lg:px-10 lg:py-28"
      dir="rtl"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_36%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_34%)]" />

      <div className="absolute -right-32 top-16 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2">
            <Sparkles size={16} className="text-cyan-300" />

            <span className="text-xs font-black tracking-wide text-cyan-200">
              Commercial Engagement Model
            </span>
          </div>

          <h1 className="mt-7 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            ابدأ بتحدٍ واضح،
            <span className="block bg-gradient-to-l from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
              أثبت القيمة، ثم توسّع بثقة
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            يقدم KAFU AI نموذج تعاون مؤسسي مرحلي يبدأ بالاكتشاف التنفيذي،
            وينتقل إلى تجربة Pilot قابلة للقياس، ثم إلى نشر مؤسسي وتعاون مستمر
            قائم على النتائج.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {engagementBenefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <CheckCircle2
                  size={18}
                  className="shrink-0 text-emerald-400"
                />

                <span className="text-sm font-bold leading-6 text-slate-200">
                  {benefit}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/welcome"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-white px-7 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-100"
            >
              ناقش تحدي مؤسستك
              <ArrowLeft size={18} />
            </Link>

            <Link
              href="/executive-summary"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/[0.05] px-7 py-3 text-sm font-black text-white transition hover:border-white/30 hover:bg-white/10"
            >
              شاهد العرض التنفيذي
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-1 rounded-[2.25rem] bg-gradient-to-br from-cyan-400/20 via-transparent to-emerald-400/20 blur-xl" />

          <article className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-black text-cyan-300">
                  نقطة البداية الموصى بها
                </p>

                <h2 className="mt-3 text-3xl font-black text-white">
                  Enterprise Pilot
                </h2>

                <p className="mt-4 max-w-lg text-sm leading-7 text-slate-400">
                  تجربة تنفيذية محددة المدة والنطاق، مرتبطة بنتيجة مؤسسية حقيقية
                  ومؤشرات نجاح متفق عليها مسبقًا.
                </p>
              </div>

              <span className="w-fit rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-black text-emerald-300">
                Recommended
              </span>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {pilotMetrics.map((metric) => {
                const Icon = metric.icon;

                return (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 transition hover:border-cyan-300/20 hover:bg-slate-950/80"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-cyan-300">
                        <Icon size={19} />
                      </span>

                      <p className="text-xs font-bold text-slate-500">
                        {metric.label}
                      </p>
                    </div>

                    <p className="mt-4 text-lg font-black text-white">
                      {metric.value}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.06] p-5">
              <p className="text-xs font-black text-cyan-300">
                القرار المتوقع بعد الـ Pilot
              </p>

              <p className="mt-2 text-sm leading-7 text-slate-300">
                قرار واضح ومدعوم بالبيانات حول التوسع، إعادة ضبط النطاق، أو
                الانتقال إلى نشر مؤسسي كامل.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}