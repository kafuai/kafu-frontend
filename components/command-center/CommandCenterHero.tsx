import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

type CommandCenterHeroProps = {
  locale: "ar" | "en";
};

export default function CommandCenterHero({
  locale,
}: CommandCenterHeroProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-medium)]">
      <div className="h-1 w-full bg-[var(--brand-primary)]" />

      <div className="flex flex-col gap-6 px-6 py-6 md:px-8 md:py-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--brand-subtle)] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--brand-primary)]">
            <Activity size={14} />

            <span>AI Command Center</span>
          </div>

          <h1 className="mt-4 text-2xl font-black tracking-tight text-[var(--text-primary)] md:text-4xl">
            {locale === "ar"
              ? "مركز قيادة المؤسسة الذكي"
              : "Enterprise AI Command Center"}
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] md:text-base">
            {locale === "ar"
              ? "راقب الوكلاء الرقميين والتنبيهات والأنشطة والتوصيات التنفيذية من مساحة قيادة موحدة."
              : "Monitor digital agents, alerts, activity, and executive recommendations from one unified command workspace."}
          </p>

          <Link
            href="/dashboard"
            className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-4 text-sm font-black text-[var(--text-primary)] shadow-sm transition hover:border-[var(--brand-primary)] hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
          >
            <span>
              {locale === "ar"
                ? "فتح لوحة القيادة التنفيذية"
                : "Open Executive Dashboard"}
            </span>

            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="flex w-full items-center gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--success-background)] px-4 py-3.5 lg:w-auto lg:min-w-[230px]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--success)] shadow-sm">
            <CheckCircle2 size={18} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-black text-[var(--success)]">
              {locale === "ar"
                ? "جميع الأنظمة تعمل"
                : "All Systems Operational"}
            </p>

            <div className="mt-1.5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />

              <p className="text-[11px] font-bold text-[var(--text-secondary)]">
                {locale === "ar"
                  ? "صحة الأنظمة 99%"
                  : "99% System Health"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
