import { AIExecutionInsight } from "./aiExecutionInsight";
import {
  AIExecutionIntelligenceCategory,
  AIExecutionIntelligenceTrend,
} from "./aiExecutionIntelligenceTypes";

export interface AIExecutionPatternSummary {
  category: AIExecutionIntelligenceCategory;
  trend: AIExecutionIntelligenceTrend;
  averageConfidence: number;
  insightCount: number;
  highestConfidence: number;
}

export function analyzeAIExecutionPatterns(
  insights: AIExecutionInsight[],
): AIExecutionPatternSummary[] {
  const groups = new Map<
    AIExecutionIntelligenceCategory,
    AIExecutionInsight[]
  >();

  for (const insight of insights) {
    const existing = groups.get(insight.category);

    if (existing) {
      existing.push(insight);
    } else {
      groups.set(insight.category, [insight]);
    }
  }

  const summaries: AIExecutionPatternSummary[] = [];

  for (const [category, categoryInsights] of groups) {
    const totalConfidence = categoryInsights.reduce(
      (sum, item) => sum + item.confidenceScore,
      0,
    );

    const averageConfidence =
      categoryInsights.length === 0
        ? 0
        : totalConfidence / categoryInsights.length;

    const highestConfidence = Math.max(
      ...categoryInsights.map((item) => item.confidenceScore),
    );

    const trendCounts = new Map<AIExecutionIntelligenceTrend, number>();

    for (const insight of categoryInsights) {
      trendCounts.set(
        insight.trend,
        (trendCounts.get(insight.trend) ?? 0) + 1,
      );
    }

    let dominantTrend: AIExecutionIntelligenceTrend = "unknown";
    let highestCount = 0;

    for (const [trend, count] of trendCounts) {
      if (count > highestCount) {
        dominantTrend = trend;
        highestCount = count;
      }
    }

    summaries.push({
      category,
      trend: dominantTrend,
      averageConfidence,
      insightCount: categoryInsights.length,
      highestConfidence,
    });
  }

  return summaries;
}