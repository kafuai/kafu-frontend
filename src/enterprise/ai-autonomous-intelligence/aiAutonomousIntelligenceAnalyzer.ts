import { AIAutonomousIntelligenceInsight } from "./aiAutonomousIntelligenceInsight";
import { AIAutonomousIntelligenceSignal } from "./aiAutonomousIntelligenceSignal";

export interface AIAutonomousIntelligenceAnalysisResult {
  organizationId: string;
  analyzedSignals: number;
  generatedInsights: number;
  highPriorityInsights: number;
}

export function analyzeAIAutonomousIntelligence(
  signals: AIAutonomousIntelligenceSignal[],
  insights: AIAutonomousIntelligenceInsight[],
): AIAutonomousIntelligenceAnalysisResult {
  const organizationId =
    signals[0]?.organizationId ??
    insights[0]?.organizationId ??
    "";

  return {
    organizationId,
    analyzedSignals: signals.length,
    generatedInsights: insights.length,
    highPriorityInsights: insights.filter(
      (insight) =>
        insight.priority === "high" ||
        insight.priority === "urgent",
    ).length,
  };
}