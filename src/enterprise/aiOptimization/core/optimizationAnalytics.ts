import { OptimizationOpportunity } from "./optimizationOpportunity";

export interface OptimizationAnalytics {
  totalOpportunities: number;
  averageConfidence: number;
  highPriorityCount: number;
  generatedAt: Date;
}

export function buildOptimizationAnalytics(
  opportunities: OptimizationOpportunity[],
): OptimizationAnalytics {
  const total = opportunities.length;

  const averageConfidence =
    total === 0
      ? 0
      : opportunities.reduce((sum, item) => sum + item.confidence, 0) / total;

  const highPriorityCount = opportunities.filter(
    (item) => item.priority === "high" || item.priority === "critical",
  ).length;

  return {
    totalOpportunities: total,
    averageConfidence,
    highPriorityCount,
    generatedAt: new Date(),
  };
}