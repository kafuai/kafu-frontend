import type { CorporateBrain } from "@/types/corporateBrainModel";

export type DecisionEngineOutput = {
  readinessLabel: string;
  recommendedDecision: string;
  decisionRisk: "low" | "medium" | "high";
};

export function runDecisionEngine(
  brain: CorporateBrain
): DecisionEngineOutput {
  if (brain.decisionReadiness === "needs_data") {
    return {
      readinessLabel: "Needs More Data",
      recommendedDecision: "استكمال البيانات قبل اتخاذ قرارات تنفيذية كبيرة.",
      decisionRisk: "medium",
    };
  }

  if (brain.decisionReadiness === "high_risk") {
    return {
      readinessLabel: "High Risk",
      recommendedDecision: "تجنب القرارات الكبيرة والتركيز على معالجة المخاطر الحرجة أولاً.",
      decisionRisk: "high",
    };
  }

  if (brain.decisionReadiness === "needs_alignment") {
    return {
      readinessLabel: "Needs Alignment",
      recommendedDecision: "مواءمة القيادة والفرق قبل بدء مبادرات التحول.",
      decisionRisk: "medium",
    };
  }

  return {
    readinessLabel: "Ready",
    recommendedDecision: "الشركة جاهزة لاتخاذ قرارات تنفيذية مبنية على التحليل الحالي.",
    decisionRisk: "low",
  };
}