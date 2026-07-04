import { AIAgentOperationTask } from "./aiAgentOperationTask";
import {
  AIAgentOperationExecutionMode,
  AIAgentOperationFailureStrategy,
} from "./aiAgentOperationTypes";

export interface AIAgentOperationPlan {
  id: string;
  organizationId: string;
  objective: string;
  executionMode: AIAgentOperationExecutionMode;
  failureStrategy: AIAgentOperationFailureStrategy;
  tasks: AIAgentOperationTask[];
  createdAt: Date;
}

export interface CreateAIAgentOperationPlanInput {
  id: string;
  organizationId: string;
  objective: string;
  executionMode?: AIAgentOperationExecutionMode;
  failureStrategy?: AIAgentOperationFailureStrategy;
  tasks: AIAgentOperationTask[];
}

export function createAIAgentOperationPlan(
  input: CreateAIAgentOperationPlanInput,
): AIAgentOperationPlan {
  if (!input.id.trim()) {
    throw new Error("AI agent operation plan id is required.");
  }

  if (!input.organizationId.trim()) {
    throw new Error("AI agent operation plan organizationId is required.");
  }

  if (!input.objective.trim()) {
    throw new Error("AI agent operation plan objective is required.");
  }

  if (input.tasks.length === 0) {
    throw new Error("AI agent operation plan requires at least one task.");
  }

  return {
    id: input.id,
    organizationId: input.organizationId,
    objective: input.objective,
    executionMode: input.executionMode ?? "sequential",
    failureStrategy: input.failureStrategy ?? "fail-fast",
    tasks: input.tasks,
    createdAt: new Date(),
  };
}

export function getExecutableAIAgentOperationTasks(
  plan: AIAgentOperationPlan,
  completedTaskIds: string[],
): AIAgentOperationTask[] {
  const completed = new Set(completedTaskIds);

  return plan.tasks.filter((task) =>
    task.dependencies.every((dependencyId) => completed.has(dependencyId)),
  );
}