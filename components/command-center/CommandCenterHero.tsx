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
    <section className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-medium)] md:p-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-subtle)] px-4 py-2 text-xs font-black text-[var(--brand-primary)]">
            <Activity size={15} />
            AI Command Center
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-[var(--text-primary)] md:text-5xl">
            {locale === "ar"
              ? "مركز قيادة المؤسسة الذكي"
              : "Enterprise AI Command Center"}
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--text-secondary)]">
            {locale === "ar"
              ? "راقب الوكلاء الرقميين والتنبيهات والأنشطة والتوصيات التنفيذية من مساحة قيادة موحدة."
              : "Monitor digital agents, alerts, activity, and executive recommendations from one unified command workspace."}
          </p>

          <Link
            href="/dashboard"
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--border-default)] px-5 font-black text-[var(--text-primary)] transition hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
          >
            {locale === "ar"
              ? "فتح لوحة القيادة التنفيذية"
              : "Open Executive Dashboard"}

            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="inline-flex w-fit items-center gap-3 rounded-2xl bg-[var(--success-background)] px-5 py-4 text-[var(--success)]">
          <CheckCircle2 size={19} />

          <div>
            <p className="text-xs font-black">
              {locale === "ar"
                ? "جميع الأنظمة تعمل"
                : "All Systems Operational"}
            </p>

            <p className="mt-1 text-[10px] opacity-80">
              {locale === "ar"
                ? "صحة الأنظمة 99%"
                : "99% System Health"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
