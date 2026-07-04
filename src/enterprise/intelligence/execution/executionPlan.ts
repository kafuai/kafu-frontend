import {
  ExecutionAction,
  ExecutionPlan,
  ExecutionPriority,
} from "./executionTypes";

export function createExecutionPlan(input: {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  priority?: ExecutionPriority;
  actions?: ExecutionAction[];
}): ExecutionPlan {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    title: input.title,
    description: input.description,
    status: "planned",
    priority: input.priority ?? "medium",
    actions: input.actions ?? [],
    createdAt: now,
    updatedAt: now,
  };
}