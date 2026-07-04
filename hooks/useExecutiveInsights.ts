import { useMemo } from "react";
import {
  DiscoveryAnswer,
  ExecutiveSummaryCompany,
  ExecutiveMetric,
} from "@/types/executiveSummary";
import { generateExecutiveReportInsights } from "@/lib/executiveReportEngine";
import { generateCorporateDNA } from "@/lib/corporateDNAService";
import { buildCorporateBrain } from "@/lib/corporateBrain";
import { generateCorporateBrainInsights } from "@/lib/corporateBrainInsights";

export function useExecutiveInsights(
  company: ExecutiveSummaryCompany | null,
  answers: DiscoveryAnswer[],
) {
  const insights = useMemo(
    () => generateExecutiveReportInsights(company, answers),
    [company, answers],
  );

  const corporateDNA = useMemo(() => {
    if (!company) return null;

    return generateCorporateDNA({
      company,
      aiConfidence: insights.aiConfidence,
      dataQualityScore: insights.dataQualityScore,
      maturityScore: insights.score,
    });
  }, [
    company,
    insights.aiConfidence,
    insights.dataQualityScore,
    insights.score,
  ]);

  const corporateBrain = useMemo(() => {
    if (!corporateDNA) return null;
    return buildCorporateBrain(corporateDNA);
  }, [corporateDNA]);

  const brainInsights = useMemo(() => {
    if (!corporateBrain) return null;
    return generateCorporateBrainInsights(corporateBrain);
  }, [corporateBrain]);

  const opportunities = useMemo(() => {
    if (!brainInsights) {
      return [
        "بناء Corporate DNA يمثل هوية المؤسسة التشغيلية.",
        "إنشاء Corporate Brain يعتمد على المعرفة الداخلية.",
        "تأسيس Digital Workforce يعمل جنباً إلى جنب مع الموظفين.",
      ];
    }

    return [
      brainInsights.summary,
      brainInsights.decision.recommendedDecision,
      brainInsights.strategy.thinkingSummary,
    ];
  }, [brainInsights]);

  const executiveMetrics: ExecutiveMetric[] = useMemo(
    () => [
      {
        label: "Executive Readiness",
        value: `${insights.score}%`,
        note: insights.status,
      },
      {
        label: "AI Confidence",
        value: `${insights.aiConfidence}%`,
        note: "مستوى ثقة التحليل بناءً على جودة البيانات",
      },
      {
        label: "Data Quality",
        value: `${insights.dataQualityScore}%`,
        note: "اكتمال بيانات الشركة ومدخلات Discovery",
      },
      {
        label: "Discovery Completion",
        value: `${insights.discoveryCompletion}%`,
        note: "نسبة اكتمال جلسة الاستكشاف",
      },
    ],
    [
      insights.aiConfidence,
      insights.dataQualityScore,
      insights.discoveryCompletion,
      insights.score,
      insights.status,
    ],
  );

  return {
    insights,
    corporateDNA,
    corporateBrain,
    brainInsights,
    opportunities,
    executiveMetrics,
  };
}