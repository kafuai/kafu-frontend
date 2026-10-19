"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";


const ARABIC_CONTENT = {
  badge: "ابدأ بتجربة موجهة",
  title: "ابدأ بتحويل تحدٍ مؤسسي حقيقي إلى قرار وتنفيذ قابل للقياس",
  description:
    "نبدأ بنطاق واضح، ومؤشرات نجاح متفق عليها، وتجربة تنفيذية توضح قيمة KAFU AI داخل مؤسستك.",
  cta: "ابدأ الآن",
} as const;


const ENGLISH_CONTENT = {
  badge: "Start with a Controlled Pilot",
  title: "Start transforming a real enterprise challenge into measurable decisions and execution",
  description:
    "We start with a clear scope, agreed-upon success metrics, and an executive pilot that demonstrates the value of KAFU AI within your organization.",
  cta: "Get Started Now",
} as const;

export function LandingCTA() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const content = isArabic ? ARABIC_CONTENT : ENGLISH_CONTENT;

  return (
    <section 
      dir={isArabic ? "rtl" : "ltr"}
      className="bg-[var(--landing-bg-primary)] px-6 py-16 lg:px-10 lg:py-20"
    >
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-[var(--landing-accent-border)] bg-[var(--landing-surface)] px-7 py-12 text-center shadow-[var(--shadow-large)] sm:px-12 lg:px-16 lg:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--landing-accent)_16%,transparent),transparent_42%),linear-gradient(135deg,color-mix(in_srgb,var(--landing-surface)_96%,var(--landing-accent-soft)),var(--landing-surface))]"
        />

        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--landing-accent)] sm:text-sm">
            {content.badge}
          </p>

          <h2 className="mx-auto mt-4 max-w-4xl text-3xl font-bold leading-[1.25] tracking-[-0.03em] text-[var(--landing-text-primary)] sm:text-4xl lg:text-5xl">
            {content.title}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--landing-text-secondary)] sm:text-lg">
            {content.description}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/book-demo"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--landing-text-primary)] px-7 py-3 text-sm font-extrabold text-[var(--landing-bg-primary)] shadow-[var(--shadow-medium)] transition duration-200 hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--landing-surface)]"
            >
              <span>{content.cta}</span>
              {isArabic ? <ArrowLeft size={17} /> : <ArrowRight size={17} />}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}