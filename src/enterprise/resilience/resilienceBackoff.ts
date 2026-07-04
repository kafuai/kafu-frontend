import { BackoffStrategy } from "./resilienceTypes";

export type BackoffCalculationInput = {
  attempt: number;
  strategy: BackoffStrategy;
  baseDelayMs: number;
  maxDelayMs?: number;
};

export function calculateBackoffDelay(input: BackoffCalculationInput): number {
  const attempt = Math.max(1, input.attempt);
  const baseDelay = Math.max(0, input.baseDelayMs);

  let delay = baseDelay;

  if (input.strategy === "linear") {
    delay = baseDelay * attempt;
  }

  if (input.strategy === "exponential") {
    delay = baseDelay * 2 ** (attempt - 1);
  }

  if (input.maxDelayMs !== undefined) {
    return Math.min(delay, input.maxDelayMs);
  }

  return delay;
}