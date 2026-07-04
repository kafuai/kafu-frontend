import { ResilienceMetrics, calculateRetrySuccessRate } from "./resilienceMetrics";

export type ResilienceReport = {
  generatedAt: Date;
  metrics: ResilienceMetrics;
  retrySuccessRate: number;
  health: "excellent" | "stable" | "weak";
};

export function createResilienceReport(
  metrics: ResilienceMetrics,
): ResilienceReport {
  const retrySuccessRate = calculateRetrySuccessRate(metrics);

  let health: ResilienceReport["health"] = "excellent";

  if (retrySuccessRate < 0.95) {
    health = "stable";
  }

  if (retrySuccessRate < 0.75) {
    health = "weak";
  }

  return {
    generatedAt: new Date(),
    metrics,
    retrySuccessRate,
    health,
  };
}