import type {
  ExecutiveAIInsightCategory,
  ExecutiveAIInsightPriority,
  ExecutiveAIInsightSeverity,
  ExecutiveAIInsightTrend,
} from "./ExecutiveAIInsightTypes";

export const clampExecutiveAIInsightScore = (
  value: number,
): number =>
  Math.min(
    100,
    Math.max(0, value),
  );

export const roundExecutiveAIInsightNumber = (
  value: number,
): number =>
  Math.round(
    (value + Number.EPSILON) * 100,
  ) / 100;

export const resolveExecutiveAIInsightPriority = (
  severity:
    ExecutiveAIInsightSeverity,
): ExecutiveAIInsightPriority => {
  switch (severity) {
    case "critical":
      return "critical";

    case "high":
      return "high";

    case "medium":
      return "medium";

    case "low":
    case "informational":
    default:
      return "low";
  }
};

export const resolveExecutiveAIInsightTrend = (
  current: number,
  previous?: number,
): {
  trend: ExecutiveAIInsightTrend;
  percentage?: number;
} => {
  if (
    previous === undefined
    || previous === 0
  ) {
    return {
      trend: "stable",
    };
  }

  const percentage =
    (
      (current - previous)
      / Math.abs(previous)
    ) * 100;

  if (percentage <= -15) {
    return {
      trend: "strong-decline",
      percentage:
        roundExecutiveAIInsightNumber(
          percentage,
        ),
    };
  }

  if (percentage <= -5) {
    return {
      trend: "decline",
      percentage:
        roundExecutiveAIInsightNumber(
          percentage,
        ),
    };
  }

  if (percentage >= 15) {
    return {
      trend: "strong-improvement",
      percentage:
        roundExecutiveAIInsightNumber(
          percentage,
        ),
    };
  }

  if (percentage >= 5) {
    return {
      trend: "improving",
      percentage:
        roundExecutiveAIInsightNumber(
          percentage,
        ),
    };
  }

  return {
    trend: "stable",
    percentage:
      roundExecutiveAIInsightNumber(
        percentage,
      ),
  };
};

export const resolveExecutiveCategoryLabel = (
  category:
    ExecutiveAIInsightCategory,
): string => {
  const labels:
    Record<
      ExecutiveAIInsightCategory,
      string
    > = {
      revenue: "Revenue",
      pipeline: "Pipeline",
      forecast: "Forecast",
      opportunity: "Opportunity",
      "sales-performance":
        "Sales performance",
      risk: "Risk",
      customer: "Customer",
      operations: "Operations",
      strategy: "Strategy",
    };

  return labels[category];
};

export const severityWeight:
  Readonly<Record<
    ExecutiveAIInsightSeverity,
    number
  >> = {
    informational: 0,
    low: 10,
    medium: 30,
    high: 60,
    critical: 100,
  };
