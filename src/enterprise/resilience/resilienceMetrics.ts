export type ResilienceMetrics = {
  retries: number;
  successfulRetries: number;
  failedRetries: number;
  failovers: number;
  selfHealingExecutions: number;
};

export function createEmptyResilienceMetrics(): ResilienceMetrics {
  return {
    retries: 0,
    successfulRetries: 0,
    failedRetries: 0,
    failovers: 0,
    selfHealingExecutions: 0,
  };
}

export function calculateRetrySuccessRate(
  metrics: ResilienceMetrics,
): number {
  if (metrics.retries === 0) {
    return 1;
  }

  return metrics.successfulRetries / metrics.retries;
}