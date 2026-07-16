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

  const recommendations = [
    {
      icon: BookOpenCheck,
      title:
        locale === "ar"
          ? "استكمال قاعدة المعرفة الداخلية"
          : "Complete the internal knowledge base",
      description:
        locale === "ar"
          ? "رفع السياسات والإجراءات والنماذج الأكثر استخدامًا وربطها بمصادر موثوقة."
          : "Upload the most-used policies, procedures, and templates and connect them to verified sources.",
      priority: "critical" as RecommendationPriority,
      impact:
        locale === "ar"
          ? "تقليل الأخطاء وتوحيد القرارات"
          : "Reduce errors and standardize decisions",
      confidence: 94,
      expectedOutcome:
        locale === "ar"
          ? "رفع جاهزية المعرفة المؤسسية وتحسين دقة إجابات الذكاء الاصطناعي."
          : "Increase enterprise knowledge readiness and improve AI response accuracy.",
    },
    {
      icon: Workflow,
      title:
        locale === "ar"
          ? "ربط القرارات بمسؤولي التنفيذ"
          : "Connect decisions to execution owners",
      description:
        locale === "ar"
          ? "تحويل الأولويات التنفيذية إلى مهام محددة بمالك وموعد نهائي ومؤشر نجاح."
          : "Convert executive priorities into tasks with owners, deadlines, and success indicators.",
      priority: "high" as RecommendationPriority,
      impact:
        locale === "ar"
          ? "زيادة سرعة التنفيذ والمساءلة"
          : "Improve execution speed and accountability",
      confidence: 91,
      expectedOutcome:
        locale === "ar"
          ? "خفض القرارات المعلقة وزيادة وضوح مسؤولية التنفيذ."
          : "Reduce stalled decisions and increase execution ownership clarity.",
    },
    {
      icon: Link2,
      title:
        locale === "ar"
          ? "توحيد مؤشرات الأداء"
          : "Unify performance indicators",
      description:
        locale === "ar"
          ? "ربط مؤشرات الأداء التشغيلية والمالية والاستراتيجية بمركز القيادة."
          : "Connect operational, financial, and strategic indicators to the command center.",
      priority: "medium" as RecommendationPriority,
      impact:
        locale === "ar"
          ? "تحسين جودة المتابعة التنفيذية"
          : "Improve executive performance visibility",
      confidence: 87,
      expectedOutcome:
        locale === "ar"
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

      <section className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)] md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
              <Target size={20} />
            </span>

            <div>
              <h2 className="text-lg font-black text-[var(--text-primary)]">
                {locale === "ar"
                  ? "التوصيات التنفيذية ذات الأولوية"
                  : "Priority Executive Recommendations"}
              </h2>

              <p className="mt-1 max-w-3xl text-xs leading-6 text-[var(--text-muted)]">
                {locale === "ar"
                  ? "قرارات مقترحة بناءً على معرفة المؤسسة وإشارات الاستكشاف ومستوى الأثر."
                  : "Recommended decisions based on enterprise knowledge, discovery signals, and business impact."}
              </p>
            </div>
          </div>

          <span className="w-fit rounded-full bg-[var(--brand-subtle)] px-4 py-2 text-[11px] font-black text-[var(--brand-primary)]">
            {recommendations.length}{" "}
            {locale === "ar"
              ? "توصيات نشطة"
              : "Active Recommendations"}
          </span>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
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