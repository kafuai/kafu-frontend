import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  Route,
  Sparkles,
} from "lucide-react";

type WorkspaceActionsProps = {
  locale?: "ar" | "en";
};

export default function WorkspaceActions({
  locale = "en",
}: WorkspaceActionsProps = {}) {
  const actions = [
    {
      title:
        locale === "ar"
          ? "الرحلة التنفيذية"
          : "Executive Journey",
      description:
        locale === "ar"
          ? "استكمل رحلة الاستكشاف والتوصيات التنفيذية."
          : "Continue executive discovery and recommendations.",
      href: "/journey",
      icon: Route,
    },
    {
      title:
        locale === "ar"
          ? "الوحدات الذكية"
          : "AI Modules",
      description:
        locale === "ar"
          ? "استعرض الوحدات الذكية المناسبة لاحتياجات المؤسسة."
          : "Explore AI modules recommended for the organization.",
      href: "/modules",
      icon: Sparkles,
    },
    {
      title:
        locale === "ar"
          ? "القوى العاملة الرقمية"
          : "Digital Workforce",
      description:
        locale === "ar"
          ? "راجع الوكلاء الرقميين المقترحين لدعم عمليات المؤسسة."
          : "Review digital agents recommended for the organization.",
      href: "/digital-workforce",
      icon: Bot,
    },
  ];

  return (
    <section className="grid h-full gap-4 md:grid-cols-3">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <Link
            key={action.href}
            href={action.href}
            className="group flex min-h-[190px] flex-col rounded-[18px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)] transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--brand-primary)_28%,var(--border-default))] hover:shadow-[var(--shadow-medium)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-[13px] bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                <Icon size={19} />
              </span>

              <ArrowUpRight
                size={17}
                className="text-[var(--text-muted)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--brand-primary)] rtl:group-hover:-translate-x-0.5"
              />
            </div>

            <h3 className="mt-5 text-base font-extrabold text-[var(--text-primary)]">
              {action.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {action.description}
            </p>

            <span className="mt-auto pt-4 text-xs font-extrabold text-[var(--brand-primary)]">
              {locale === "ar" ? "فتح المسار" : "Open workspace"}
            </span>
          </Link>
        );
      })}
    </section>
  );
}
