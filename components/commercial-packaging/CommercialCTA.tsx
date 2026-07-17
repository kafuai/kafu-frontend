import Link from "next/link";

export function CommercialCTA() {
  return (
    <section className="bg-slate-900 px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-slate-950 px-7 py-16 text-center sm:px-14">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
          Start the Conversation
        </p>

        <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          حدد التحدي الذي يستحق أن نبدأ منه
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          نساعدك على تحديد أفضل نطاق لأول Pilot، وصياغة مؤشرات النجاح،
          وتجهيز خطة تنفيذ وعرض تجاري يناسب مؤسستك.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/welcome"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-100"
          >
            ابدأ Executive Discovery
          </Link>

          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </section>
  );
}
