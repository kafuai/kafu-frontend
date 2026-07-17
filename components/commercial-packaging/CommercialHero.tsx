import Link from "next/link";

export function CommercialHero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 px-6 py-24 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_42%)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Commercial Engagement Model
          </p>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            ابدأ بتحدٍ واضح، أثبت القيمة، ثم توسع بثقة
          </h1>

          <p className="mt-7 text-lg leading-8 text-slate-300 sm:text-xl">
            يقدم KAFU AI نموذج تعاون مرحليًا للمؤسسات يبدأ بالاكتشاف التنفيذي،
            ينتقل إلى Pilot قابل للقياس، ثم إلى نشر مؤسسي وتعاون مستمر.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/welcome"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-100"
            >
              ناقش تحدي مؤسستك
            </Link>

            <Link
              href="/executive-summary"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              شاهد Executive Demo
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur">
          <p className="text-sm font-semibold text-cyan-200">
            Recommended Starting Point
          </p>

          <h2 className="mt-3 text-3xl font-semibold text-white">
            Enterprise Pilot
          </h2>

          <p className="mt-4 leading-7 text-slate-400">
            تجربة تنفيذية محددة المدة والنطاق، مرتبطة بنتيجة مؤسسية حقيقية
            ومؤشرات نجاح متفق عليها.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-4">
            <Metric label="Typical Duration" value="3–6 Weeks" />
            <Metric label="Primary Goal" value="Prove Value" />
            <Metric label="Scope" value="Focused" />
            <Metric label="Outcome" value="Scale Decision" />
          </div>
        </div>
      </div>
    </section>
  );
}

interface MetricProps {
  label: string;
  value: string;
}

function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 font-semibold text-white">{value}</p>
    </div>
  );
}
