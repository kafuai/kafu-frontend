import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

type CommandCenterFooterProps = {
  locale: "ar" | "en";
};

export default function CommandCenterFooter({
  locale,
}: CommandCenterFooterProps) {
  const isArabic = locale === "ar";

  const dashboardLink = (
    <Link
      href="/dashboard"
      className="inline-flex min-h-11 w-fit shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 text-sm font-black text-white shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
    >
      <span>
        {isArabic
          ? "فتح لوحة القيادة"
          : "Open Executive Dashboard"}
      </span>

      <ArrowUpRight
        size={16}
        className={isArabic ? "-scale-x-100" : ""}
      />
    </Link>
  );

  return (
    <section className="rounded-3xl border border-[var(--border-default)] bg-[var(--brand-subtle)] px-6 py-5 md:px-8 md:py-6">
      <div
        className={
          isArabic
            ? "flex flex-col"
            : "flex flex-col gap-5 md:flex-row md:items-center md:justify-between"
        }
      >
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand-primary)] shadow-sm">
              <ShieldCheck size={20} />
            </div>

            <h2 className="text-xl font-black tracking-tight text-[var(--text-primary)] md:text-2xl">
              {isArabic
                ? "المنصة جاهزة للمراجعة التنفيذية"
                : "Platform Ready for Executive Review"}
            </h2>
          </div>

          <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] md:text-base">
            {isArabic
              ? "استعرض أداء المؤسسة والتوصيات والقرارات من لوحة القيادة التنفيذية."
              : "Review enterprise performance, recommendations, and decisions from the executive dashboard."}
          </p>

          {isArabic && (
            <div className="mt-4">
              {dashboardLink}
            </div>
          )}
        </div>

        {!isArabic && dashboardLink}
      </div>
    </section>
  );
}