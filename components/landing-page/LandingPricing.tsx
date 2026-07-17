import Link from "next/link";

const PRICING_FEATURES = [
  "Executive discovery and assessment",
  "Enterprise intelligence outputs",
  "Priority recommendations",
  "Command center tracking",
  "Pilot success measurement",
  "Executive review and scale roadmap",
] as const;

export function LandingPricing() {
  return (
    <section className="border-b border-white/10 bg-slate-900 px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Engagement Model
          </p>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            ابدأ بنطاق عملي ثم توسع بناءً على القيمة
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            يبدأ التعاون باكتشاف تنفيذي أو Pilot محدد النطاق، ثم يتم الانتقال
            إلى النشر المؤسسي بناءً على النتائج والقيمة المحققة.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-3xl rounded-[2rem] border border-cyan-300/25 bg-slate-950 p-7 shadow-2xl sm:p-10">
          <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-cyan-300">
                Recommended Starting Point
              </p>

              <h3 className="mt-3 text-3xl font-semibold text-white">
                Enterprise Pilot
              </h3>
            </div>

            <div className="sm:text-right">
              <p className="text-sm text-slate-500">Typical Duration</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                3–6 Weeks
              </p>
            </div>
          </div>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {PRICING_FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-slate-300"
              >
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            <Link
              href="/commercial"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-100"
            >
              استعرض النموذج التجاري
            </Link>

            <Link
              href="/welcome"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              ناقش نطاق الـ Pilot
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
