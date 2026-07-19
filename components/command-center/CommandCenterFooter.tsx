import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

type CommandCenterFooterProps = {
  locale: "ar" | "en";
};

export default function CommandCenterFooter({
  locale,
}: CommandCenterFooterProps) {
  const isArabic = locale === "ar";

  return (
    <section className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] px-5 py-5 shadow-[var(--shadow-small)] md:px-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <ShieldCheck size={19} />
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-black tracking-tight text-[var(--text-primary)]">
                {isArabic
                  ? "المنصة جاهزة للمراجعة التنفيذية"
                  : "Platform Ready for Executive Review"}
              </h2>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black text-emerald-700">
                <CheckCircle2 size={11} />
                {isArabic ? "جاهز" : "Ready"}
              </span>
            </div>

            <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">
              {isArabic
                ? "استعرض أداء المؤسسة والتوصيات والقرارات من لوحة القيادة التنفيذية ضمن مساحة موحدة وآمنة."
                : "Review enterprise performance, recommendations, and decisions from one unified and secure executive workspace."}
            </p>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex min-h-11 w-fit shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
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
      </div>
    </section>
  );
}
