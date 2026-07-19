import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

type CommandCenterHeroProps = {
  locale: "ar" | "en";
};

export default function CommandCenterHero({
  locale,
}: CommandCenterHeroProps) {
  const isArabic = locale === "ar";

  return (
    <section className="relative overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-[var(--brand-primary)]" />
      <div className="pointer-events-none absolute -end-16 -top-20 h-48 w-48 rounded-full bg-[var(--brand-subtle)] blur-3xl" />

      <div className="relative flex flex-col gap-5 px-5 py-6 md:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-subtle)] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--brand-primary)]">
            <Sparkles size={12} />
            <span>AI Command Center</span>
          </div>

          <h1 className="mt-3 max-w-3xl text-2xl font-black tracking-tight text-[var(--text-primary)] md:text-3xl">
            {isArabic
              ? "مركز قيادة المؤسسة الذكي"
              : "Enterprise AI Command Center"}
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">
            {isArabic
              ? "رؤية موحدة لمتابعة الوكلاء الرقميين والتنبيهات والأنشطة والتوصيات التنفيذية في الوقت الفعلي."
              : "A unified real-time view of digital agents, executive alerts, operational activity, and AI recommendations."}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
            >
              <span>
                {isArabic
                  ? "فتح لوحة القيادة التنفيذية"
                  : "Open Executive Dashboard"}
              </span>

              <ArrowUpRight
                size={16}
                className={isArabic ? "-scale-x-100" : ""}
              />
            </Link>

            <div className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface-muted)] px-4 text-xs font-bold text-[var(--text-secondary)]">
              <Activity size={15} className="text-[var(--brand-primary)]" />

              <span>
                {isArabic
                  ? "مراقبة مباشرة للعمليات"
                  : "Live operational monitoring"}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full rounded-xl border border-emerald-200 bg-emerald-50 p-4 lg:w-[250px] lg:shrink-0">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700">
              <CheckCircle2 size={19} />
            </span>

            <div className="min-w-0">
              <p className="text-sm font-black text-slate-950">
                {isArabic
                  ? "جميع الأنظمة تعمل"
                  : "All Systems Operational"}
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                {isArabic
                  ? "المنصة والخدمات الأساسية مستقرة"
                  : "Platform and core services are stable"}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-lg bg-white px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-600 opacity-30" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
              </span>

              <span className="text-[11px] font-bold text-slate-600">
                {isArabic ? "صحة الأنظمة" : "System health"}
              </span>
            </div>

            <span className="text-sm font-black text-emerald-700" dir="ltr">
              99%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
