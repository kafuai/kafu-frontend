import { AIOrchestrationExecution } from "./aiOrchestrationExecution";
import { AIOrchestrationPlan } from "./aiOrchestrationPlanner";
import {
  AIOrchestrationResult,
  AIOrchestrationStepResult,
  addAIOrchestrationStepResult,
  completeAIOrchestrationResult,
} from "./aiOrchestrationResult";

export class AIOrchestrationEngine {
  execute(
    execution: AIOrchestrationExecution,
    plan: AIOrchestrationPlan,
  ): AIOrchestrationResult {
    let result = {
      executionId: execution.id,
      workflowId: execution.workflowId,
      organizationId: execution.organizationId,
      success: true,
      startedAt: new Date(),
      stepResults: [],
    } as AIOrchestrationResult;

    for (const item of plan.items) {
      const stepResult: AIOrchestrationStepResult = {
        stepId: item.step.id,
        success: true,
        outputs: {},
        warnings: [],
        errors: [],
        durationMs: 0,
      };

      result = addAIOrchestrationStepResult(result, stepResult);
    }

    return completeAIOrchestrationResult(result);
  }
}