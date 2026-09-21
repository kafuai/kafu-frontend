"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";

// --- المحتوى العربي ---
const ARABIC_CONTENT = {
  badge: "منصة الذكاء والتنفيذ المؤسسي",
  title: "حوّل معرفة مؤسستك إلى قرارات وتنفيذ",
  description:
    "يمنح KAFU AI القيادة رؤية موحدة للمؤسسة، ويحوّل البيانات والتحديات والأولويات إلى توصيات واضحة، ومسؤوليات محددة، ومتابعة تنفيذية مستمرة.",
  cta: "ابدأ تجربة KAFU AI",
  benefits: ["فهم مؤسسي أعمق", "قرارات أسرع", "تنفيذ أكثر وضوحًا"],
  card: {
    subtitle: "النظرة التنفيذية",
    title: "الذكاء المؤسسي",
    live: "مباشر",
    metrics: [
      { label: "الجاهزية", value: "87%" },
      { label: "إجراءات الأولوية", value: "12" },
      { label: "القرارات النشطة", value: "8" },
      { label: "صحة التنفيذ", value: "92%" },
    ],
    aiTitle: "توصية تنفيذية من KAFU AI",
    aiDescription:
      "أعطِ الأولوية لتخطيط قدرات القوى العاملة، واربط مبادرات التحول بمسؤولين واضحين ونتائج قابلة للقياس.",
  },
} as const;

// --- المحتوى الإنجليزي ---
const ENGLISH_CONTENT = {
  badge: "Enterprise Intelligence & Execution Platform",
  title: "Transform your organization's knowledge into decisions and execution",
  description:
    "KAFU AI provides leadership with a unified view of the enterprise, transforming data, challenges, and priorities into clear recommendations, defined responsibilities, and continuous execution tracking.",
  cta: "Get started with KAFU AI",
  benefits: ["Deeper organizational understanding", "Faster decisions", "Clearer execution"],
  card: {
    subtitle: "Executive View",
    title: "Enterprise Intelligence",
    live: "Live",
    metrics: [
      { label: "Readiness", value: "87%" },
      { label: "Priority Actions", value: "12" },
      { label: "Active Decisions", value: "8" },
      { label: "Execution Health", value: "92%" },
    ],
    aiTitle: "Executive Recommendation from KAFU AI",
    aiDescription:
      "Prioritize workforce capacity planning, and link transformation initiatives to clear owners and measurable outcomes.",
  },
} as const;

export function LandingHero() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const content = isArabic ? ARABIC_CONTENT : ENGLISH_CONTENT;

  return (
    <section 
      dir={isArabic ? "rtl" : "ltr"}
      className="relative overflow-hidden border-b border-[var(--landing-border)] bg-[var(--landing-bg-primary)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--landing-accent)_14%,transparent),transparent_40%),radial-gradient(circle_at_bottom_left,color-mix(in_srgb,var(--brand-primary)_9%,transparent),transparent_36%)]"
      />

      <div className="relative mx-auto grid min-h-[610px] max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.06fr_0.94fr] lg:px-10 lg:py-20 xl:gap-14">
        <div className="max-w-3xl text-start">
          <div className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--landing-accent-border)] bg-[var(--landing-accent-soft)] px-4 text-sm font-semibold text-[var(--landing-accent-strong)]">
            <Sparkles size={16} />
            <span>{content.badge}</span>
          </div>

          <h1 className="mt-6 max-w-3xl text-[42px] font-bold leading-[1.15] tracking-[-0.035em] text-[var(--landing-text-primary)] sm:text-5xl lg:text-[58px]">
            {content.title}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--landing-text-secondary)] sm:text-lg">
            {content.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/book-demo"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--landing-text-primary)] px-6 py-3 text-sm font-extrabold text-[var(--landing-bg-primary)] shadow-[var(--shadow-medium)] transition duration-200 hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--landing-bg-primary)]"
            >
              <span>{content.cta}</span>
              {isArabic ? <ArrowLeft size={17} /> : <ArrowRight size={17} />}
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-[var(--landing-text-secondary)]">
            {content.benefits.map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <CheckCircle2
                  size={15}
                  className="text-[var(--landing-accent)]"
                />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative text-start">
          <div className="rounded-[26px] border border-[var(--landing-border)] bg-[var(--landing-surface-muted)] p-4 shadow-[var(--shadow-large)] backdrop-blur-sm sm:p-5">
            <div className="rounded-[20px] border border-[var(--landing-border)] bg-[var(--landing-surface)] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-5 border-b border-[var(--landing-border)] pb-5">
                <div>
                  <p className="text-sm font-medium text-[var(--landing-text-secondary)]">
                    {content.card.subtitle}
                  </p>

                  <h2 className="mt-1.5 text-xl font-bold text-[var(--landing-text-primary)]">
                    {content.card.title}
                  </h2>
                </div>

                <div className="inline-flex min-h-8 items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--success)_22%,transparent)] bg-[var(--success-background)] px-3 text-xs font-bold text-[var(--success)]">
                  <span className="h-2 w-2 rounded-full bg-current" />
                  {content.card.live}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {content.card.metrics.map((metric, idx) => (
                  <MetricCard key={idx} label={metric.label} value={metric.value} />
                ))}
              </div>

              <div className="mt-4 rounded-[16px] border border-[var(--landing-accent-border)] bg-[var(--landing-accent-soft)] p-4">
                <p className="text-sm font-bold text-[var(--landing-accent-strong)]">
                  {content.card.aiTitle}
                </p>

                <p className="mt-2 text-sm leading-7 text-[var(--landing-text-secondary)]">
                  {content.card.aiDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
}

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <article className="rounded-[15px] border border-[var(--landing-border)] bg-[var(--landing-surface-muted)] px-4 py-4 transition-colors duration-200 hover:bg-[var(--landing-surface-hover)]">
      <p className="text-xs font-medium text-[var(--landing-text-secondary)]">
        {label}
      </p>
      {/* القيمة الرقمية تُترك كـ ltr لكي تظهر النسبة المئوية والأرقام بشكل صحيح دائماً */}
      <p
        className="mt-2 text-2xl font-bold leading-none text-[var(--landing-text-primary)]"
        dir="ltr" 
      >
        {value}
      </p>
    </article>
  );
}