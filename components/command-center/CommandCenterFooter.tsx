import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

type CommandCenterFooterProps = {
  locale: "ar" | "en";
};

export default function CommandCenterFooter({
  locale,
}: CommandCenterFooterProps) {
  return (
    <section className="flex flex-col justify-between gap-6 rounded-[28px] border border-[var(--border-default)] bg-[var(--brand-subtle)] p-6 md:flex-row md:items-center md:p-8">
      <div>
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-[var(--brand-primary)]" />

          <h2 className="text-2xl font-black text-[var(--text-primary)]">
            {locale === "ar"
              ? "المنصة جاهزة للمراجعة التنفيذية"
              : "Platform Ready for Executive Review"}
          </h2>
        </div>

        <p className="mt-3 max-w-3xl leading-7 text-[var(--text-secondary)]">
          {locale === "ar"
            ? "استعرض أداء المؤسسة والتوصيات والقرارات من لوحة القيادة التنفيذية."
            : "Review enterprise performance, recommendations, and decisions from the executive dashboard."}
        </p>
      </div>

      <Link
        href="/dashboard"
        className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--text-primary)] px-6 font-black text-[var(--surface)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
      >
        {locale === "ar"
          ? "فتح لوحة القيادة"
          : "Open Executive Dashboard"}

        <ArrowUpRight size={17} />
      </Link>
    </section>
  );
}