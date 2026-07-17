import type {
  ExecutiveDemoAnalyticsSnapshot,
  ExecutiveDemoAnalyticsStatus,
} from "./executiveDemoAnalyticsTypes";

export interface ExecutiveDemoAnalyticsScorecard {
  totalMetrics: number;
  healthyMetrics: number;
  attentionMetrics: number;
  criticalMetrics: number;
  unknownMetrics: number;
  overallScore: number;
  overallStatus: ExecutiveDemoAnalyticsStatus;
}

function countMetricsByStatus(
  snapshot: ExecutiveDemoAnalyticsSnapshot,
  status: ExecutiveDemoAnalyticsStatus,
): number {
  return snapshot.metrics.filter(
    (metric) => metric.status === status,
  ).length;
}

function resolveOverallStatus(
  score: number,
): ExecutiveDemoAnalyticsStatus {
  if (score >= 80) {
    return "healthy";
  }

  if (score >= 60) {
    return "attention";
  }

  return "critical";
}

export function buildExecutiveDemoAnalyticsScorecard(
  snapshot: ExecutiveDemoAnalyticsSnapshot,
): ExecutiveDemoAnalyticsScorecard {
  const totalMetrics = snapshot.metrics.length;
  const healthyMetrics = countMetricsByStatus(snapshot, "healthy");
  const attentionMetrics = countMetricsByStatus(
    snapshot,
    "attention",
  );
  const criticalMetrics = countMetricsByStatus(
    snapshot,
    "critical",
  );
  const unknownMetrics = countMetricsByStatus(snapshot, "unknown");

  const weightedScore =
    healthyMetrics * 100 +
    attentionMetrics * 65 +
    criticalMetrics * 25;

  const measurableMetrics = totalMetrics - unknownMetrics;

  const overallScore =
    measurableMetrics > 0
      ? Math.round(weightedScore / measurableMetrics)
      : 0;

  return {
    totalMetrics,
    healthyMetrics,
    attentionMetrics,
    criticalMetrics,
    unknownMetrics,
    overallScore,
    overallStatus:
      measurableMetrics > 0
        ? resolveOverallStatus(overallScore)
        : "unknown",
  };
}
