import { AutomationDefinition } from "./automationTypes";
import {
  executeAutomationFlow,
  AutomationExecutionFlowResult,
} from "./automationExecutionFlow";
import {
  AutomationExecutionPolicy,
  DEFAULT_AUTOMATION_EXECUTION_POLICY,
} from "./automationExecutionPolicy";
import {
  evaluateAutomationPolicy,
  AutomationPolicyEvaluation,
} from "./automationPolicyEvaluator";

export type AutomationOrchestrationResult = {
  execution: AutomationExecutionFlowResult;
  policy: AutomationPolicyEvaluation;
};

export function orchestrateAutomation(
  automation: AutomationDefinition,
  policy: AutomationExecutionPolicy = DEFAULT_AUTOMATION_EXECUTION_POLICY,
): AutomationOrchestrationResult {
  const execution = executeAutomationFlow(automation);

  const evaluation = evaluateAutomationPolicy({
    attempt: 1,
    startedAt: execution.monitoring.collectedAt,
    policy,
  });

  return {
    execution,
    policy: evaluation,
  };
}