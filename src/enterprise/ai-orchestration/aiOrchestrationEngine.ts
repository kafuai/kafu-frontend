import { AIOrchestrationExecution } from "./aiOrchestrationExecution";
import { AIOrchestrationExecutionSnapshot, createExecutionSnapshot } from "./aiOrchestrationExecutionSnapshot";
import { AIOrchestrationExecutionContext, createAIOrchestrationExecutionContext } from "./aiOrchestrationExecutionContext";
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
    const context: AIOrchestrationExecutionContext =
      createAIOrchestrationExecutionContext(
        execution.id,
        execution.workflowId,
        execution.organizationId,
      );

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

    const snapshot: AIOrchestrationExecutionSnapshot =
      createExecutionSnapshot(
        execution.id,
        "completed",
        context,
      );

    void snapshot;

    return completeAIOrchestrationResult(result);
  }
}