import {
  AutomationRetryPolicy,
  DEFAULT_AUTOMATION_RETRY_POLICY,
} from "./automationRetryPolicy";

export type AutomationExecutionPolicy = {
  retry: AutomationRetryPolicy;
  timeoutMs?: number;
};

export const DEFAULT_AUTOMATION_EXECUTION_POLICY: AutomationExecutionPolicy = {
  retry: DEFAULT_AUTOMATION_RETRY_POLICY,
  timeoutMs: 30000,
};