import type {
  ExecutiveDemoAnalyticsStatus,
  ExecutiveDemoAnalyticsTrend,
} from "./executiveDemoAnalyticsTypes";

export function calculatePercentage(
  value: number,
  total: number,
): number {
  if (!Number.isFinite(value) || !Number.isFinite(total) || total <= 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

export function normalizeScore(score: number): number {
  if (!Number.isFinite(score)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
}

export function calculateTrend(
  currentValue: number,
  previousValue?: number,
): ExecutiveDemoAnalyticsTrend {
  if (
    previousValue === undefined ||
    !Number.isFinite(currentValue) ||
    !Number.isFinite(previousValue)
  ) {
    return "unknown";
  }

  if (currentValue > previousValue) {
    return "up";
  }

  if (currentValue < previousValue) {
    return "down";
  }

  return "stable";
}

export function resolvePercentageStatus(
  value: number,
  healthyThreshold = 75,
  attentionThreshold = 50,
): ExecutiveDemoAnalyticsStatus {
  if (!Number.isFinite(value)) {
    return "unknown";
  }

  if (value >= healthyThreshold) {
    return "healthy";
  }

  if (value >= attentionThreshold) {
    return "attention";
  }

  return "critical";
}
