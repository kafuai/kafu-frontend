import { AIOrchestrationCapabilityRegistry } from "./aiOrchestrationCapabilityRegistry";
import { AIOrchestrationContext } from "./aiOrchestrationContext";
import { AIOrchestrationPlan } from "./aiOrchestrationPlanner";
import {
  addAIOrchestrationStepResult,
  completeAIOrchestrationResult,
  createAIOrchestrationResult,
  AIOrchestrationResult,
} from "./aiOrchestrationResult";
import { createAIOrchestrationRoutePlan } from "./aiOrchestrationRoutePlan";

export interface AIOrchestrationRuntimeInput {
  executionId: string;
  plan: AIOrchestrationPlan;
  context: AIOrchestrationContext;
  registry: AIOrchestrationCapabilityRegistry;
}

export function runAIOrchestrationRuntime(
  input: AIOrchestrationRuntimeInput,
): AIOrchestrationResult {
  const routePlan = createAIOrchestrationRoutePlan(
    input.plan,
    input.executionId,
    input.context,
    input.registry,
  );

  let result = createAIOrchestrationResult(
    input.executionId,
    input.plan.workflowId,
    input.plan.organizationId,
  );

  for (const decision of routePlan.decisions) {
    result = addAIOrchestrationStepResult(result, {
      stepId: decision.stepId,
      success: decision.routed,
      outputs: {
        capabilityId: decision.capabilityId,
        routed: decision.routed,
      },
      warnings: decision.routed ? [] : ["Step could not be routed."],
      errors: decision.routed ? [] : ["No matching orchestration capability found."],
      durationMs: 0,
    });
  }

  return completeAIOrchestrationResult(result);
}