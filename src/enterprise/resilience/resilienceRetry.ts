import {
  ResilienceExecutionContext,
  ResilienceExecutionResult,
  ResiliencePolicy,
} from "./resilienceTypes";
import { calculateBackoffDelay } from "./resilienceBackoff";

export type RetryOperation<T> = (
  context: ResilienceExecutionContext,
) => Promise<T>;

export async function executeWithRetry<T>(
  policy: ResiliencePolicy,
  context: Omit<ResilienceExecutionContext, "attempt">,
  operation: RetryOperation<T>,
): Promise<ResilienceExecutionResult<T>> {
  const maxAttempts = policy.maxAttempts ?? 1;
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const result = await operation({
        ...context,
        attempt,
      });

      return {
        success: true,
        status: attempt > 1 ? "recovering" : "healthy",
        attempts: attempt,
        result,
        recovered: attempt > 1,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxAttempts) {
        const delay = calculateBackoffDelay({
          attempt,
          strategy: policy.backoffStrategy ?? "fixed",
          baseDelayMs: policy.baseDelayMs ?? 0,
          maxDelayMs: policy.maxDelayMs,
        });

        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
  }

  return {
    success: false,
    status: "failed",
    attempts: maxAttempts,
    error: lastError,
    recovered: false,
  };
}