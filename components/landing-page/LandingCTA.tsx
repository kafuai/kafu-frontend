import Link from "next/link";

export function LandingCTA() {
  return (
    <section className="bg-slate-950 px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.2),transparent_45%),linear-gradient(135deg,rgba(15,23,42,1),rgba(2,6,23,1))] px-7 py-16 text-center shadow-2xl sm:px-14">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
          Start with a Controlled Pilot
        </p>

        <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          ابدأ بتحويل تحدٍ مؤسسي حقيقي إلى قرار وتنفيذ قابل للقياس
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          نبدأ بنطاق واضح، ومؤشرات نجاح متفق عليها، وتجربة تنفيذية توضح قيمة
          KAFU AI داخل مؤسستك.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/welcome"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-100"
          >
            ابدأ الآن
          </Link>

          <Link
            href="/executive-summary"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            شاهد Executive Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
