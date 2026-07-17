import type {
  ExecutiveDemoIntelligenceConfidence,
  ExecutiveDemoIntelligenceInsight,
  ExecutiveDemoIntelligencePriority,
  ExecutiveDemoIntelligenceResult,
} from "./executiveDemoIntelligenceTypes";

export interface ExecutiveDemoIntelligenceDecision {
  id: string;
  title: string;
  summary: string;
  priority: ExecutiveDemoIntelligencePriority;
  confidence: ExecutiveDemoIntelligenceConfidence;
  rationale: string;
  recommendedAction: string;
  supportingInsightIds: string[];
}

export function buildExecutiveDemoIntelligenceDecision(
  result: ExecutiveDemoIntelligenceResult,
): ExecutiveDemoIntelligenceDecision {
  const primaryInsight = result.insights[0];

  if (primaryInsight) {
    return buildDecisionFromInsight(
      result.sessionId,
      primaryInsight,
      result.primaryRecommendation,
    );
  }

  return {
    id: `${result.sessionId}-decision`,
    title: "Advance the executive AI journey",
    summary: result.executiveSummary,
    priority: "medium",
    confidence: result.confidence,
    rationale:
      "The available executive intelligence supports moving toward a focused next step.",
    recommendedAction: result.primaryRecommendation,
    supportingInsightIds: [],
  };
}

function buildDecisionFromInsight(
  sessionId: string,
  insight: ExecutiveDemoIntelligenceInsight,
  fallbackRecommendation: string,
): ExecutiveDemoIntelligenceDecision {
  return {
    id: `${sessionId}-decision-${insight.id}`,
    title: insight.title,
    summary: insight.summary,
    priority: insight.priority,
    confidence: insight.confidence,
    rationale: insight.rationale,
    recommendedAction:
      insight.recommendedAction ?? fallbackRecommendation,
    supportingInsightIds: [insight.id],
  };
}
