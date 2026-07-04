import { generateAIObservabilityInsights } from "./aiObservabilityInsights";
import { AIObservabilitySignal } from "./aiObservabilityTypes";

export interface AIObservabilityExecutiveSummary {
  organizationId: string;
  summary: string;
  insightCount: number;
  generatedAt: Date;
}

export function buildAIObservabilityExecutiveSummary(
  organizationId: string,
  signals: AIObservabilitySignal[],
): AIObservabilityExecutiveSummary {
  const insights = generateAIObservabilityInsights(signals);

  const summary =
    insights.length === 0
      ? "AI observability indicators are stable. No significant operational concerns detected."
      : `Generated ${insights.length} observability insight(s) requiring engineering attention.`;

  return {
    organizationId,
    summary,
    insightCount: insights.length,
    generatedAt: new Date(),
  };
}