import {
  calculatePercentage,
  normalizeScore,
  resolvePercentageStatus,
} from "./executiveDemoAnalyticsCalculations";
import type {
  ExecutiveDemoAnalyticsInput,
  ExecutiveDemoAnalyticsMetric,
  ExecutiveDemoAnalyticsSnapshot,
  ExecutiveDemoAnalyticsSummary,
} from "./executiveDemoAnalyticsTypes";

export function buildExecutiveDemoAnalyticsSummary(
  input: ExecutiveDemoAnalyticsInput,
): ExecutiveDemoAnalyticsSummary {
  return {
    completionRate: calculatePercentage(
      input.completedDemoSteps,
      input.totalDemoSteps,
    ),
    insightPriorityRate: calculatePercentage(
      input.highPriorityInsights,
      input.totalInsights,
    ),
    recommendationAcceptanceRate: calculatePercentage(
      input.acceptedRecommendations,
      input.totalRecommendations,
    ),
    executiveReadinessScore: normalizeScore(
      input.executiveReadinessScore,
    ),
    intelligenceConfidenceScore: normalizeScore(
      input.intelligenceConfidenceScore,
    ),
    estimatedAnnualValue: Math.max(
      0,
      input.estimatedAnnualValue ?? 0,
    ),
    estimatedTimeSavedHours: Math.max(
      0,
      input.estimatedTimeSavedHours ?? 0,
    ),
  };
}

export function buildExecutiveDemoAnalyticsMetrics(
  summary: ExecutiveDemoAnalyticsSummary,
): ExecutiveDemoAnalyticsMetric[] {
  return [
    {
      id: "demo-completion-rate",
      label: "Demo Completion Rate",
      description:
        "Percentage of executive demo steps completed successfully.",
      type: "percentage",
      value: summary.completionRate,
      unit: "%",
      trend: "unknown",
      status: resolvePercentageStatus(summary.completionRate, 90, 70),
    },
    {
      id: "high-priority-insight-rate",
      label: "High Priority Insight Rate",
      description:
        "Percentage of generated insights classified as high priority.",
      type: "percentage",
      value: summary.insightPriorityRate,
      unit: "%",
      trend: "unknown",
      status: resolvePercentageStatus(
        summary.insightPriorityRate,
        60,
        30,
      ),
    },
    {
      id: "recommendation-acceptance-rate",
      label: "Recommendation Acceptance Rate",
      description:
        "Percentage of recommendations accepted during the demo.",
      type: "percentage",
      value: summary.recommendationAcceptanceRate,
      unit: "%",
      trend: "unknown",
      status: resolvePercentageStatus(
        summary.recommendationAcceptanceRate,
        75,
        50,
      ),
    },
    {
      id: "executive-readiness-score",
      label: "Executive Readiness Score",
      description:
        "Overall readiness score for executive decision-making.",
      type: "score",
      value: summary.executiveReadinessScore,
      unit: "/100",
      trend: "unknown",
      status: resolvePercentageStatus(
        summary.executiveReadinessScore,
        80,
        60,
      ),
    },
    {
      id: "intelligence-confidence-score",
      label: "Intelligence Confidence Score",
      description:
        "Confidence level of the executive intelligence outputs.",
      type: "score",
      value: summary.intelligenceConfidenceScore,
      unit: "/100",
      trend: "unknown",
      status: resolvePercentageStatus(
        summary.intelligenceConfidenceScore,
        80,
        60,
      ),
    },
    {
      id: "estimated-annual-value",
      label: "Estimated Annual Value",
      description:
        "Estimated annual financial value identified by the demo.",
      type: "currency",
      value: summary.estimatedAnnualValue,
      unit: "SAR",
      trend: "unknown",
      status:
        summary.estimatedAnnualValue > 0 ? "healthy" : "unknown",
    },
    {
      id: "estimated-time-saved",
      label: "Estimated Time Saved",
      description:
        "Estimated annual operational time saved.",
      type: "duration",
      value: summary.estimatedTimeSavedHours,
      unit: "hours",
      trend: "unknown",
      status:
        summary.estimatedTimeSavedHours > 0 ? "healthy" : "unknown",
    },
  ];
}

export function buildExecutiveDemoAnalyticsSnapshot(
  input: ExecutiveDemoAnalyticsInput,
): ExecutiveDemoAnalyticsSnapshot {
  const summary = buildExecutiveDemoAnalyticsSummary(input);

  return {
    organizationId: input.organizationId,
    sessionId: input.sessionId,
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    summary,
    metrics: buildExecutiveDemoAnalyticsMetrics(summary),
  };
}
