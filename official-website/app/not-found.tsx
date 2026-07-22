"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";

import { useWebsiteLanguage } from "@/components/localization";

const content = {
  en: {
    eyebrow: "Error 404",
    title: "This page could not be found.",
    description:
      "The address may be incorrect, or the page may have moved. Return to the KAFU AI website to continue exploring the platform.",
    home: "Return Home",
    platform: "Explore Platform",
  },
  ar: {
    eyebrow: "خطأ 404",
    title: "تعذر العثور على هذه الصفحة.",
    description:
      "قد يكون العنوان غير صحيح أو تم نقل الصفحة. عد إلى موقع KAFU AI لمواصلة استكشاف المنصة.",
    home: "العودة للرئيسية",
    platform: "استكشف المنصة",
  },
};

export default function NotFound() {
  const { language } = useWebsiteLanguage();
  const pageContent = content[language];
  const DirectionIcon = language === "ar" ? ArrowRight : ArrowLeft;

  return (
    <section className="flex min-h-[58vh] items-center bg-[var(--surface-soft)] px-5 py-16 sm:py-20">
      <div className="website-shell">
        <div className="mx-auto max-w-2xl rounded-[28px] border border-[var(--border-default)] bg-white px-6 py-10 text-center shadow-[var(--shadow-md)] sm:px-12 sm:py-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
            {pageContent.eyebrow}
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl">
            {pageContent.title}
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-base leading-8 text-[var(--text-secondary)]">
            {pageContent.description}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              <Home size={17} />
              {pageContent.home}
            </Link>

            <Link
              href="/platform"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--border-default)] bg-white px-6 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--border-strong)]"
            >
              <DirectionIcon size={17} />
              {pageContent.platform}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
