import Link from "next/link";

export default function ExecutiveFooter() {
  return (
    <section className="relative mt-16 overflow-hidden rounded-[2.75rem] border border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white shadow-[0_40px_120px_rgba(15,23,42,0.24)]">
      <div className="pointer-events-none absolute -right-36 -top-36 h-96 w-96 rounded-full bg-emerald-500/12 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-44 -left-44 h-[28rem] w-[28rem] rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative z-10 grid gap-12 p-8 sm:p-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-center lg:p-14">
        <div>
          <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.34em] text-emerald-300">
            Executive Decision
          </span>

          <h2 className="mt-7 max-w-4xl text-4xl font-black leading-tight tracking-tight md:text-5xl xl:text-6xl">
            هل يعكس هذا التقرير واقع مؤسستكم؟
          </h2>

          <p className="mt-7 max-w-4xl text-lg leading-9 text-slate-300">
            إذا كانت هذه القراءة دقيقة، فإن الخطوة التالية هي بناء
            <span className="font-black text-white"> Corporate DNA </span>
            ليصبح الأساس الذي تعتمد عليه التحليلات، التوصيات، ووكلاء الذكاء
            الاصطناعي داخل المؤسسة.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            {[
              "Corporate DNA",
              "Corporate Brain",
              "Digital Workforce",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-bold text-slate-200 backdrop-blur transition-all duration-300 hover:bg-white/15"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <aside className="rounded-[2.25rem] border border-white/10 bg-white/[0.06] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.16)] backdrop-blur-xl">
          <div className="space-y-4">
            <Link
              href="/corporate-dna"
              className="block rounded-2xl bg-emerald-500 px-8 py-5 text-center text-lg font-black text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-[0_20px_50px_rgba(16,185,129,0.25)]"
            >
              بدء بناء Corporate DNA
            </Link>

            <Link
              href="/discovery"
              className="block rounded-2xl border border-white/10 bg-white/10 px-8 py-5 text-center text-lg font-black text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15"
            >
              مراجعة إجابات Discovery
            </Link>
          </div>

          <div className="mt-8 border-t border-white/10 pt-7">
            <p className="text-[11px] font-black uppercase tracking-[0.34em] text-slate-400">
              Next Milestone
            </p>

            <h3 className="mt-4 text-2xl font-black">
              Corporate DNA Foundation
            </h3>

            <p className="mt-4 leading-8 text-slate-300">
              الانتقال من مرحلة التحليل التنفيذي إلى بناء المعرفة المؤسسية
              والهوية التشغيلية الذكية.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}