import Link from "next/link";
import { ArrowLeft, CalendarDays, Rocket, Sparkles } from "lucide-react";

export function CommercialCTA() {
  return (
    <section
      className="relative overflow-hidden bg-slate-900 px-4 py-20 sm:px-6 lg:px-10 lg:py-28"
      dir="rtl"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_40%)]" />

      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-black shadow-2xl">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative px-8 py-16 text-center sm:px-12 lg:px-20">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-300/10 text-cyan-300">
            <Sparkles size={30} />
          </div>

          <p className="mt-6 text-sm font-black tracking-[0.18em] text-cyan-300 uppercase">
            Start the Conversation
          </p>

          <h2 className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            حدّد التحدي الذي
            <span className="block bg-gradient-to-l from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
              يستحق أن نبدأ منه
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-slate-400 sm:text-lg">
            نساعدك في اختيار أفضل نطاق لأول Pilot، وتحديد مؤشرات النجاح،
            وإعداد خطة تنفيذ وعرض تجاري يناسب احتياجات مؤسستك ويقود إلى نتائج
            قابلة للقياس.
          </p>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <CalendarDays
                size={24}
                className="mx-auto text-cyan-300"
              />
              <p className="mt-4 text-sm font-black text-white">
                جلسة اكتشاف تنفيذية
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <Rocket size={24} className="mx-auto text-emerald-300" />
              <p className="mt-4 text-sm font-black text-white">
                Pilot قابل للقياس
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <Sparkles size={24} className="mx-auto text-cyan-300" />
              <p className="mt-4 text-sm font-black text-white">
                خارطة طريق للتوسع
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/welcome"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-white px-8 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-100"
            >
              ابدأ Executive Discovery
              <ArrowLeft size={18} />
            </Link>

            <Link
              href="/"
              className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/20 bg-white/[0.05] px-8 py-3 text-sm font-black text-white transition hover:bg-white/10"
            >
              العودة إلى الصفحة الرئيسية
            </Link>
          </div>

          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="text-sm leading-7 text-slate-400">
              كل مشروع يبدأ بفهم التحدي الحقيقي، ثم إثبات القيمة، ثم التوسع
              بثقة. هذه هي المنهجية التي بُني عليها KAFU AI.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}