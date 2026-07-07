export interface AIOrchestrationRetryPolicy {
  readonly maxRetries: number;
  readonly retryDelayMs: number;
  readonly exponentialBackoff: boolean;
}

export function shouldRetryExecution(
  attempts: number,
  policy: AIOrchestrationRetryPolicy,
): boolean {
  return attempts < policy.maxRetries;
}

export function calculateRetryDelay(
  attempts: number,
  policy: AIOrchestrationRetryPolicy,
): number {
  if (!policy.exponentialBackoff) {
    return policy.retryDelayMs;
  }

  return policy.retryDelayMs * Math.pow(2, attempts);
}