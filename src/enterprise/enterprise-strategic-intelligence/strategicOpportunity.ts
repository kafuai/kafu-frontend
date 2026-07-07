import {
  StrategicRecommendation,
  StrategicSignal,
} from "./strategicIntelligenceTypes";

export function identifyStrategicOpportunities(
  signals: StrategicSignal[],
): StrategicRecommendation[] {
  return signals
    .filter((signal) => signal.impact >= 0.7 && signal.confidence >= 0.6)
    .map((signal) => ({
      id: `opportunity-${signal.id}`,
      title: `Opportunity: ${signal.title}`,
      description: signal.description,
      expectedImpact: signal.impact,
      riskLevel: signal.priority === "critical" ? "high" : "medium",
    }));
}