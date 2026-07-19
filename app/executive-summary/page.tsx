"use client";

import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Banknote,
  BriefcaseBusiness,
  CheckCircle2,
  CircleAlert,
  Clock3,
  LineChart,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound,
} from "lucide-react";

import {
  ExecutiveButton,
  StatusBadge,
} from "../../src/product/executive-design-system";
import { useLocalization } from "@/components/localization/LocalizationContext";

const content = {
  en: {
    languageLabel: "العربية",
    eyebrow: "Today’s Executive Briefing",
    title: "Three priorities require your attention.",
    subtitle:
      "Your organization is operating within normal parameters. The following items have the greatest impact on growth and execution today.",
    reviewTime: "Estimated review time",
    reviewValue: "4 minutes",
    healthLabel: "Enterprise Health",
    healthValue: "86 / 100",
    healthStatus: "Healthy",
    prioritiesLabel: "Executive Priorities",
    priorities: [
      {
        title: "Revenue Growth",
        insight: "Enterprise sales growth is 8% below forecast.",
        impact: "$2.8M pipeline value requires action.",
        action: "Review opportunities",
        status: "attention",
        icon: TrendingUp,
      },
      {
        title: "Operational Efficiency",
        insight: "Proposal approvals now average 11 days.",
        impact: "Approval delays are slowing conversion.",
        action: "Remove bottlenecks",
        status: "critical",
        icon: Clock3,
      },
      {
        title: "Strategic Execution",
        insight: "Two strategic initiatives are behind schedule.",
        impact: "Execution confidence has declined to 73%.",
        action: "Reprioritize execution",
        status: "attention",
        icon: Target,
      },
    ],
    snapshotLabel: "Business Snapshot",
    metrics: [
      {
        label: "Revenue",
        value: "$12.4M",
        trend: "+8.2%",
        helper: "vs. previous quarter",
        icon: Banknote,
      },
      {
        label: "Cash Position",
        value: "Stable",
        trend: "14.6 months",
        helper: "estimated runway",
        icon: LineChart,
      },
      {
        label: "AI Workforce",
        value: "23 Active",
        trend: "91%",
        helper: "task completion rate",
        icon: UsersRound,
      },
      {
        label: "Critical Risks",
        value: "3",
        trend: "1 new",
        helper: "since yesterday",
        icon: ShieldAlert,
      },
    ],
    aiTitle: "KAFU AI Executive Insight",
    aiText:
      "The company remains financially healthy. Current growth constraints are operational rather than financial.",
    aiConfidence: "AI confidence: 96%",
    primaryAction: "Continue to Company Health",
    secondaryAction: "Return to Welcome",
    nextHref: "/company-dashboard",
    backHref: "/welcome",
  },
  ar: {
    languageLabel: "English",
    eyebrow: "الإحاطة التنفيذية لليوم",
    title: "ثلاث أولويات تتطلب انتباهك.",
    subtitle:
      "تعمل المؤسسة ضمن مستويات الأداء الطبيعية، وتمثل العناصر التالية أكبر أثر مباشر على النمو والتنفيذ اليوم.",
    reviewTime: "الوقت المتوقع للمراجعة",
    reviewValue: "4 دقائق",
    healthLabel: "صحة المؤسسة",
    healthValue: "86 / 100",
    healthStatus: "جيدة",
    prioritiesLabel: "الأولويات التنفيذية",
    priorities: [
      {
        title: "نمو الإيرادات",
        insight: "نمو مبيعات قطاع الشركات أقل من التوقعات بنسبة 8%.",
        impact: "فرص بقيمة 2.8 مليون دولار تتطلب إجراءً.",
        action: "مراجعة الفرص",
        status: "attention",
        icon: TrendingUp,
      },
      {
        title: "الكفاءة التشغيلية",
        insight: "متوسط اعتماد العروض أصبح 11 يومًا.",
        impact: "تأخر الاعتمادات يبطئ تحويل الفرص.",
        action: "إزالة نقاط التعطيل",
        status: "critical",
        icon: Clock3,
      },
      {
        title: "التنفيذ الاستراتيجي",
        insight: "هناك مبادرتان استراتيجيتان متأخرتان.",
        impact: "انخفضت موثوقية التنفيذ إلى 73%.",
        action: "إعادة ترتيب التنفيذ",
        status: "attention",
        icon: Target,
      },
    ],
    snapshotLabel: "ملخص الأعمال",
    metrics: [
      {
        label: "الإيرادات",
        value: "12.4 مليون $",
        trend: "+8.2%",
        helper: "مقارنة بالربع السابق",
        icon: Banknote,
      },
      {
        label: "الوضع النقدي",
        value: "مستقر",
        trend: "14.6 شهرًا",
        helper: "المدة التشغيلية التقديرية",
        icon: LineChart,
      },
      {
        label: "القوى العاملة الذكية",
        value: "23 نشطًا",
        trend: "91%",
        helper: "معدل إكمال المهام",
        icon: UsersRound,
      },
      {
        label: "المخاطر الحرجة",
        value: "3",
        trend: "1 جديد",
        helper: "منذ الأمس",
        icon: ShieldAlert,
      },
    ],
    aiTitle: "الرؤية التنفيذية من KAFU AI",
    aiText:
      "لا تزال المؤسسة في وضع مالي جيد، بينما ترتبط قيود النمو الحالية بكفاءة التنفيذ أكثر من الوضع المالي.",
    aiConfidence: "درجة ثقة التحليل: 96%",
    primaryAction: "الانتقال إلى صحة المؤسسة",
    secondaryAction: "العودة إلى الترحيب",
    nextHref: "/company-dashboard",
    backHref: "/welcome",
  },
} as const;

export default function ExecutiveSummaryPage() {
  const { locale } = useLocalization();
  const language = locale === "ar" ? "ar" : "en";
  const copy = content[language];
  const isArabic = language === "ar";
  const DirectionIcon = isArabic ? ArrowLeft : ArrowRight;

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="relative min-h-[calc(100vh-76px)] overflow-hidden bg-[var(--background)] text-[var(--text-primary)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--brand-primary)_8%,transparent),transparent_32%),radial-gradient(circle_at_bottom_right,color-mix(in_srgb,var(--brand-primary)_5%,transparent),transparent_30%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(var(--border-default)_1px,transparent_1px),linear-gradient(90deg,var(--border-default)_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <section className="relative mx-auto max-w-[1580px] space-y-6 px-5 py-5 md:px-7 lg:px-8">
        <header className="flex items-center justify-between">
          <Link href="/welcome" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-[color-mix(in_srgb,var(--brand-primary)_18%,var(--border-default))] bg-[var(--brand-subtle)] text-[var(--brand-primary)] shadow-[var(--shadow-small)]">
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-black tracking-[0.2em] text-[var(--text-primary)]">
                KAFU AI
              </p>

              <p className="text-xs text-[var(--text-muted)]">
                Enterprise Operating Intelligence
              </p>
            </div>
          </Link>
        </header>

        <section className="overflow-hidden rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
          <div className="grid gap-6 px-6 py-7 md:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className={isArabic ? "text-right" : "text-left"}><StatusBadge
                status="good"
                label={copy.eyebrow}
                className="border-[color-mix(in_srgb,var(--brand-primary)_20%,var(--border-default))] bg-[var(--brand-subtle)] px-3 py-1.5 text-[11px] tracking-wide text-[var(--brand-primary)]"
              />

              <h1 className="mt-5 max-w-4xl text-[2.2rem] font-black leading-[1.08] tracking-[-0.04em] text-[var(--text-primary)] sm:text-[2.8rem] lg:text-[3.4rem]">
                {copy.title}
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--text-secondary)] md:text-lg md:leading-8">
                {copy.subtitle}
              </p>
            </div>

            <div className={["grid gap-3 sm:grid-cols-2", isArabic ? "lg:justify-self-start" : "lg:justify-self-end"].join(" ")}>
              <article className="rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-muted)] px-5 py-4">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-5 w-5 text-[var(--brand-primary)]" />

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                      {copy.reviewTime}
                    </p>

                    <p className="mt-1 font-black text-[var(--text-primary)]">
                      {copy.reviewValue}
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-[16px] border border-[color-mix(in_srgb,var(--success)_18%,var(--border-default))] bg-[var(--success-background)] px-5 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--success)]">
                  {copy.healthLabel}
                </p>

                <div className="mt-1.5 flex items-center gap-3">
                  <p className="text-xl font-black text-[var(--text-primary)]">
                    {copy.healthValue}
                  </p>

                  <StatusBadge
                    status="healthy"
                    label={copy.healthStatus}
                    className="border-[color-mix(in_srgb,var(--success)_22%,var(--border-default))] bg-[var(--surface)] text-[var(--success)]"
                  />
                </div>
              </article>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-3">
            <BriefcaseBusiness className="h-5 w-5 text-[var(--brand-primary)]" />

            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-[var(--text-secondary)]">
              {copy.prioritiesLabel}
            </h2>
          </div>

          <div className="grid items-stretch gap-4 lg:grid-cols-3">
            {copy.priorities.map((priority, index) => {
              const Icon = priority.icon;
              const isCritical = priority.status === "critical";

              return (
                <article
                  key={priority.title}
                  className="group flex h-full flex-col rounded-[18px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-medium)]"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={[
                        "flex h-11 w-11 items-center justify-center rounded-[14px]",
                        isCritical
                          ? "bg-[var(--critical-background)] text-[var(--critical)]"
                          : "bg-[var(--warning-background)] text-[var(--warning)]",
                      ].join(" ")}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="text-xs font-black text-[var(--text-muted)]">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-black text-[var(--text-primary)]">
                    {priority.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                    {priority.insight}
                  </p>

                  <div className="mt-5 flex items-start gap-2 rounded-[14px] border border-[var(--border-default)] bg-[var(--surface-muted)] p-4">
                    {isCritical ? (
                      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[var(--critical)]" />
                    ) : (
                      <Activity className="mt-0.5 h-4 w-4 shrink-0 text-[var(--warning)]" />
                    )}

                    <p className="text-xs leading-5 text-[var(--text-secondary)]">
                      {priority.impact}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-black text-[var(--brand-primary)] transition hover:opacity-80"
                  >
                    {priority.action}
                    <DirectionIcon className="h-4 w-4" />
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-3">
            <Activity className="h-5 w-5 text-[var(--brand-primary)]" />

            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-[var(--text-secondary)]">
              {copy.snapshotLabel}
            </h2>
          </div>

          <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {copy.metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <article
                  key={metric.label}
                  className="rounded-[18px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-medium)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-secondary)]">
                        {metric.label}
                      </p>

                      <p className="mt-2 text-2xl font-black text-[var(--text-primary)]">
                        {metric.value}
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-5 border-t border-[var(--border-default)] pt-4">
                    <p className="text-sm font-black text-[var(--success)]">
                      {metric.trend}
                    </p>

                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      {metric.helper}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-[20px] border border-[color-mix(in_srgb,var(--brand-primary)_18%,var(--border-default))] bg-[var(--brand-subtle)] p-6 shadow-[var(--shadow-small)] sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex max-w-4xl items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-[var(--surface)] text-[var(--brand-primary)] shadow-[var(--shadow-small)]">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-xl font-black text-[var(--text-primary)]">
                  {copy.aiTitle}
                </h2>

                <p className="mt-2 leading-7 text-[var(--text-secondary)]">
                  {copy.aiText}
                </p>

                <div className="mt-3 inline-flex items-center gap-2 text-xs font-black text-[var(--brand-primary)]">
                  <CheckCircle2 className="h-4 w-4" />
                  {copy.aiConfidence}
                </div>
              </div>
            </div>

            <Link href={copy.nextHref}>
              <ExecutiveButton
                size="large"
                rightIcon={<DirectionIcon className="h-5 w-5" />}
                className="min-w-72 border-0 bg-[var(--brand-primary)] text-white shadow-[var(--shadow-medium)] hover:opacity-90"
              >
                {copy.primaryAction}
              </ExecutiveButton>
            </Link>
          </div>
        </section>

        <footer className="flex flex-col gap-4 border-t border-[var(--border-default)] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={copy.backHref}
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            {isArabic ? (
              <ArrowRight className="h-4 w-4" />
            ) : (
              <ArrowLeft className="h-4 w-4" />
            )}

            {copy.secondaryAction}
          </Link>

          <p className="text-xs text-[var(--text-muted)]">
            KAFU AI · Enterprise Operating Intelligence
          </p>
        </footer>
      </section>
    </main>
  );
}




