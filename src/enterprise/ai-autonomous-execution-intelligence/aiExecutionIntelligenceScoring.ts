import { AIExecutionInsight } from "./aiExecutionInsight";

export interface AIExecutionIntelligenceScore {
  score: number;
  totalInsights: number;
  acceptedInsights: number;
}

export function scoreAIExecutionIntelligence(
  insights: AIExecutionInsight[],
): AIExecutionIntelligenceScore {
  if (insights.length === 0) {
    return {
      score: 0,
      totalInsights: 0,
      acceptedInsights: 0,
    };
  }

  const totalScore = insights.reduce(
    (sum, insight) => sum + insight.confidenceScore,
    0,
  );

  const score = totalScore / insights.length;

  const acceptedInsights = insights.filter(
    (item) => item.confidenceScore >= 0.5,
  ).length;

  return {
    score,
    totalInsights: insights.length,
    acceptedInsights,
  };
}