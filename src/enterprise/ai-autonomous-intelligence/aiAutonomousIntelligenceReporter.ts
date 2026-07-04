import {
  AIAutonomousIntelligenceInsight,
  hasActionableAIAutonomousIntelligenceRecommendation,
} from "./aiAutonomousIntelligenceInsight";
import { AIAutonomousIntelligenceScore } from "./aiAutonomousIntelligenceScore";

export interface AIAutonomousIntelligenceReport {
  organizationId: string;
  generatedAt: Date;
  totalInsights: number;
  actionableInsights: number;
  urgentInsights: number;
  score: AIAutonomousIntelligenceScore;
  executiveSummary: string;
}

export function createAIAutonomousIntelligenceReport(
  organizationId: string,
  insights: AIAutonomousIntelligenceInsight[],
  score: AIAutonomousIntelligenceScore,
  generatedAt: Date = new Date(),
): AIAutonomousIntelligenceReport {
  const actionableInsights = insights.filter(
    hasActionableAIAutonomousIntelligenceRecommendation,
  ).length;

  const urgentInsights = insights.filter(
    (insight) => insight.priority === "urgent",
  ).length;

  return {
    organizationId,
    generatedAt,
    totalInsights: insights.length,
    actionableInsights,
    urgentInsights,
    score,
    executiveSummary:
      urgentInsights > 0
        ? "Urgent autonomous intelligence insights require executive attention."
        : actionableInsights > 0
          ? "Actionable autonomous intelligence insights are available for review."
          : "Autonomous intelligence layer is observing current enterprise signals.",
  };
}