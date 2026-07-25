import type {
  RevenueInsight,
  RevenueMetric,
  RevenueRiskSignal,
  RevenueStageConversion,
  RevenueVelocityMetrics,
} from "./revenueOperationsTypes";

import type {
  RevenueOperationsSummary,
} from "./revenueOperationsSummary";

export interface RevenueDashboard {
  generatedAt: string;
  currency: string;
  status: "healthy" | "attention" | "critical";
  metrics: RevenueMetric[];
  alerts: string[];
  insights: RevenueInsight[];
  riskSignals: RevenueRiskSignal[];
  stageConversions: RevenueStageConversion[];
  velocity: RevenueVelocityMetrics;
}

function resolveDashboardStatus(
  summary: RevenueOperationsSummary,
): RevenueDashboard["status"] {
  const criticalRisks = summary.riskSignals.filter(
    (signal) => signal.level === "critical" && signal.status === "open",
  ).length;

  const highRisks = summary.riskSignals.filter(
    (signal) => signal.level === "high" && signal.status === "open",
  ).length;

  if (
    criticalRisks > 0 ||
    summary.forecastConfidence < 0.45 ||
    summary.weightedCoverage < 0.5
  ) {
    return "critical";
  }

  if (
    highRisks > 0 ||
    summary.forecastConfidence < 0.7 ||
    summary.weightedCoverage < 1
  ) {
    return "attention";
  }

  return "healthy";
}

function createDashboardAlerts(
  summary: RevenueOperationsSummary,
): string[] {
  const alerts: string[] = [];

  const criticalRisks = summary.riskSignals.filter(
    (signal) => signal.level === "critical" && signal.status === "open",
  );

  const highRisks = summary.riskSignals.filter(
    (signal) => signal.level === "high" && signal.status === "open",
  );

  if (summary.forecastGap > 0) {
    alerts.push(
      `Revenue forecast is below target by ${summary.forecastGap.toLocaleString("en-US")} ${summary.currency}.`,
    );
  }

  if (summary.weightedCoverage < 1) {
    alerts.push(
      `Weighted pipeline coverage is ${summary.weightedCoverage.toFixed(2)}x and remains below target.`,
    );
  }

  if (criticalRisks.length > 0) {
    alerts.push(
      `${criticalRisks.length} critical revenue risk signal(s) require immediate action.`,
    );
  }

  if (highRisks.length > 0) {
    alerts.push(
      `${highRisks.length} high revenue risk signal(s) may affect forecast delivery.`,
    );
  }

  if (
    summary.forecastAccuracy &&
    summary.forecastAccuracy.accuracy < 0.7
  ) {
    alerts.push(
      `Historical forecast accuracy is ${(summary.forecastAccuracy.accuracy * 100).toFixed(1)}%.`,
    );
  }

  return alerts;
}

export function createRevenueDashboard(
  summary: RevenueOperationsSummary,
): RevenueDashboard {
  return {
    generatedAt: summary.generatedAt,
    currency: summary.currency,
    status: resolveDashboardStatus(summary),
    metrics: summary.metrics,
    alerts: createDashboardAlerts(summary),
    insights: summary.insights,
    riskSignals: summary.riskSignals,
    stageConversions: summary.stageConversions,
    velocity: summary.velocity,
  };
}