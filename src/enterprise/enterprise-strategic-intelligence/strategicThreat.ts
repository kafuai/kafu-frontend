import {
  StrategicRecommendation,
  StrategicSignal,
} from "./strategicIntelligenceTypes";

export function identifyStrategicThreats(
  signals: StrategicSignal[],
): StrategicRecommendation[] {
  return signals
    .filter((signal) => signal.priority === "high" || signal.priority === "critical")
    .map((signal) => ({
      id: `threat-${signal.id}`,
      title: `Threat: ${signal.title}`,
      description: signal.description,
      expectedImpact: signal.impact,
      riskLevel: signal.priority === "critical" ? "critical" : "high",
    }));
}