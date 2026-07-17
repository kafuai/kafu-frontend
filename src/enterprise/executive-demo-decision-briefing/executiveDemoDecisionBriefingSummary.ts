import {
  ExecutiveDecisionBriefing,
} from "./executiveDemoDecisionBriefingTypes";

export interface ExecutiveDecisionBriefingSummary {
  briefingId: string;
  companyName: string;
  title: string;
  status: string;
  priority: string;
  confidence: string;
  decisionRequired: string;
  recommendedDecision: string;
  impactAreas: string[];
  keyMetricCount: number;
  evidenceCount: number;
  riskCount: number;
  actionCount: number;
  optionCount: number;
  readinessSummary: string;
}

export function summarizeExecutiveDecisionBriefing(
  briefing: ExecutiveDecisionBriefing,
): ExecutiveDecisionBriefingSummary {
  const readinessSummary =
    briefing.status === "ready" || briefing.status === "approved"
      ? "The executive decision briefing is prepared for executive review."
      : "The executive decision briefing requires further preparation.";

  return {
    briefingId: briefing.id,
    companyName: briefing.companyName,
    title: briefing.title,
    status: briefing.status,
    priority: briefing.priority,
    confidence: briefing.confidence,
    decisionRequired: briefing.decisionRequired,
    recommendedDecision: briefing.recommendedDecision,
    impactAreas: briefing.impactAreas,
    keyMetricCount: briefing.keyMetrics.length,
    evidenceCount: briefing.evidence.length,
    riskCount: briefing.risks.length,
    actionCount: briefing.actions.length,
    optionCount: briefing.options.length,
    readinessSummary,
  };
}
