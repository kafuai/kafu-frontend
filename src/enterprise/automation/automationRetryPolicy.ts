export type AutomationRetryPolicy = {
  maxAttempts: number;
  retryDelayMs: number;
};

export const DEFAULT_AUTOMATION_RETRY_POLICY: AutomationRetryPolicy = {
  maxAttempts: 3,
  retryDelayMs: 1000,
};

export function shouldRetryAutomation(
  attempt: number,
  policy: AutomationRetryPolicy = DEFAULT_AUTOMATION_RETRY_POLICY,
): boolean {
  return attempt < policy.maxAttempts;
}