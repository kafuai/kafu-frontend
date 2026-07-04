import {
  AutomationExecutionPolicy,
  DEFAULT_AUTOMATION_EXECUTION_POLICY,
} from "./automationExecutionPolicy";
import { shouldRetryAutomation } from "./automationRetryPolicy";

export type AutomationPolicyEvaluation = {
  canRetry: boolean;
  timedOut: boolean;
};

export function evaluateAutomationPolicy(input: {
  attempt: number;
  startedAt: Date;
  now?: Date;
  policy?: AutomationExecutionPolicy;
}): AutomationPolicyEvaluation {
  const policy = input.policy ?? DEFAULT_AUTOMATION_EXECUTION_POLICY;
  const now = input.now ?? new Date();

  const elapsedMs = now.getTime() - input.startedAt.getTime();

  return {
    canRetry: shouldRetryAutomation(input.attempt, policy.retry),
    timedOut:
      typeof policy.timeoutMs === "number"
        ? elapsedMs > policy.timeoutMs
        : false,
  };
}