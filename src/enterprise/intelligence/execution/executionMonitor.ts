import { ExecutionPlan, ExecutionResult } from "./executionTypes";

export class ExecutionMonitor {
  capture(plan: ExecutionPlan, result: ExecutionResult) {
    return {
      planId: plan.id,
      status: result.status,
      totalActions: plan.actions.length,
      completedActions: result.completedActions.length,
      failedActions: result.failedActions.length,
      capturedAt: new Date(),
    };
  }
}