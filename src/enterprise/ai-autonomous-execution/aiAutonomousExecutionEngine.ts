import { decideAIAutonomousExecutionTask } from "./aiAutonomousExecutionDecision";
import { getReadyAIAutonomousExecutionTasks } from "./aiAutonomousExecutionDependency";
import { AIAutonomousExecutionPlan } from "./aiAutonomousExecutionPlan";
import { AIAutonomousExecutionPolicy } from "./aiAutonomousExecutionPolicy";
import {
  addAIAutonomousExecutionTaskResult,
  completeAIAutonomousExecutionResult,
  createAIAutonomousExecutionResult,
  AIAutonomousExecutionResult,
} from "./aiAutonomousExecutionResult";

export interface AIAutonomousExecutionEngineInput {
  executionId: string;
  plan: AIAutonomousExecutionPlan;
  policy: AIAutonomousExecutionPolicy;
}

export function runAIAutonomousExecutionEngine(
  input: AIAutonomousExecutionEngineInput,
): AIAutonomousExecutionResult {
  let result = createAIAutonomousExecutionResult(
    input.executionId,
    input.plan.id,
    input.plan.organizationId,
  );

  const readyTasks = getReadyAIAutonomousExecutionTasks(input.plan.tasks);

  for (const task of readyTasks) {
    const decision = decideAIAutonomousExecutionTask(task, input.policy);

    if (decision.decision === "execute") {
      result = addAIAutonomousExecutionTaskResult(result, {
        taskId: task.id,
        status: "executed",
        decision,
        completedAt: new Date(),
      });

      continue;
    }

    if (decision.decision === "request_approval") {
      result = addAIAutonomousExecutionTaskResult(result, {
        taskId: task.id,
        status: "waiting_approval",
        decision,
      });

      continue;
    }

    if (decision.decision === "block") {
      result = addAIAutonomousExecutionTaskResult(result, {
        taskId: task.id,
        status: "blocked",
        decision,
      });

      continue;
    }

    result = addAIAutonomousExecutionTaskResult(result, {
      taskId: task.id,
      status: "skipped",
      decision,
    });
  }

  const hasBlockedTask = result.taskResults.some(
    (taskResult) => taskResult.status === "blocked",
  );

  const hasWaitingApprovalTask = result.taskResults.some(
    (taskResult) => taskResult.status === "waiting_approval",
  );

  if (hasBlockedTask) {
    return completeAIAutonomousExecutionResult(result, "blocked");
  }

  if (hasWaitingApprovalTask) {
    return completeAIAutonomousExecutionResult(result, "waiting_approval");
  }

  return completeAIAutonomousExecutionResult(result, "completed");
}