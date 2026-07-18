"use client";

import {
  BookOpenCheck,
  Link2,
  Target,
  Workflow,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

import CorporateBrainExecutiveSummary from "./CorporateBrainExecutiveSummary";
import CorporateBrainReasoning from "./CorporateBrainReasoning";
import CorporateBrainRecommendationCard, {
  type RecommendationPriority,
} from "./CorporateBrainRecommendationCard";

interface CorporateBrainDecisionPanelProps {
  companyName: string;
  discoveryAnswerCount: number;
}

export default function CorporateBrainDecisionPanel({
  companyName,
  discoveryAnswerCount,
}: CorporateBrainDecisionPanelProps) {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";

  const recommendations = [
    {
      icon: BookOpenCheck,
      title: isArabic
        ? "استكمال قاعدة المعرفة الداخلية"
        : "Complete the internal knowledge base",
      description: isArabic
        ? "رفع السياسات والإجراءات والنماذج الأكثر استخدامًا وربطها بمصادر موثوقة."
        : "Upload the most-used policies, procedures, and templates and connect them to verified sources.",
      priority: "critical" as RecommendationPriority,
      impact: isArabic
        ? "تقليل الأخطاء وتوحيد القرارات"
        : "Reduce errors and standardize decisions",
      confidence: 94,
      expectedOutcome: isArabic
        ? "رفع جاهزية المعرفة المؤسسية وتحسين دقة إجابات الذكاء الاصطناعي."
        : "Increase enterprise knowledge readiness and improve AI response accuracy.",
    },
    {
      icon: Workflow,
      title: isArabic
        ? "ربط القرارات بمسؤولي التنفيذ"
        : "Connect decisions to execution owners",
      description: isArabic
        ? "تحويل الأولويات التنفيذية إلى مهام محددة بمالك وموعد نهائي ومؤشر نجاح."
        : "Convert executive priorities into tasks with owners, deadlines, and success indicators.",
      priority: "high" as RecommendationPriority,
      impact: isArabic
        ? "زيادة سرعة التنفيذ والمساءلة"
        : "Improve execution speed and accountability",
      confidence: 91,
      expectedOutcome: isArabic
        ? "خفض القرارات المعلقة وزيادة وضوح مسؤولية التنفيذ."
        : "Reduce stalled decisions and increase execution ownership clarity.",
    },
    {
      icon: Link2,
      title: isArabic
        ? "توحيد مؤشرات الأداء"
        : "Unify performance indicators",
      description: isArabic
        ? "ربط مؤشرات الأداء التشغيلية والمالية والاستراتيجية بمركز القيادة."
        : "Connect operational, financial, and strategic indicators to the command center.",
      priority: "medium" as RecommendationPriority,
      impact: isArabic
        ? "تحسين جودة المتابعة التنفيذية"
        : "Improve executive performance visibility",
      confidence: 87,
      expectedOutcome: isArabic
        ? "تكوين صورة موحدة للأداء وربط النتائج بالقرارات."
        : "Create a unified performance view connected directly to decisions.",
    },
  ];

  return (
    <section className="space-y-6">
      <CorporateBrainExecutiveSummary
        companyName={companyName}
        discoveryAnswerCount={discoveryAnswerCount}
      />

      <section className="overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
        <div className="border-b border-[var(--border-default)] px-5 py-5 md:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                <Target size={20} />
              </span>

              <div className="min-w-0">
                <h2 className="text-base font-black text-[var(--text-primary)] md:text-lg">
                  {isArabic
                    ? "التوصيات التنفيذية ذات الأولوية"
                    : "Priority Executive Recommendations"}
                </h2>

                <p className="mt-1 max-w-3xl text-xs leading-6 text-[var(--text-muted)]">
                  {isArabic
                    ? "قرارات مقترحة بناءً على معرفة المؤسسة وإشارات الاستكشاف ومستوى الأثر."
                    : "Recommended decisions based on enterprise knowledge, discovery signals, and business impact."}
                </p>
              </div>
            </div>

            <span className="w-fit shrink-0 rounded-full border border-[var(--brand-primary)]/20 bg-[var(--brand-subtle)] px-3 py-1.5 text-[11px] font-black text-[var(--brand-primary)]">
              {recommendations.length}{" "}
              {isArabic ? "توصيات نشطة" : "Active Recommendations"}
            </span>
          </div>
        </div>

        <div className="grid gap-4 p-5 md:p-6 xl:grid-cols-3">
          {recommendations.map((recommendation) => (
            <CorporateBrainRecommendationCard
              key={recommendation.title}
              icon={recommendation.icon}
              title={recommendation.title}
              description={recommendation.description}
              priority={recommendation.priority}
              impact={recommendation.impact}
              confidence={recommendation.confidence}
              expectedOutcome={recommendation.expectedOutcome}
            />
          ))}
        </div>
      </section>

      <CorporateBrainReasoning />
    </section>
  );
}