export type SchedulingRetryDecision = {
  shouldRetry: boolean;
  nextAttempt: number;
  delayMs: number;
  reason?: string;
};

export type SchedulingRetryPolicyInput = {
  attempt: number;
  maxRetries: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  error?: string;
};

export function calculateSchedulingRetryPolicy(
  input: SchedulingRetryPolicyInput,
): SchedulingRetryDecision {
  const baseDelayMs = input.baseDelayMs ?? 1000;
  const maxDelayMs = input.maxDelayMs ?? 30000;

  if (input.attempt >= input.maxRetries) {
    return {
      shouldRetry: false,
      nextAttempt: input.attempt,
      delayMs: 0,
      reason: input.error ?? "Maximum retry attempts reached.",
    };
  }

  const exponentialDelay = baseDelayMs * 2 ** input.attempt;

  return {
    shouldRetry: true,
    nextAttempt: input.attempt + 1,
    delayMs: Math.min(exponentialDelay, maxDelayMs),
    reason: input.error,
  };
}