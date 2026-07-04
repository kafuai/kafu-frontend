import {
  ExecutionPlan,
  ExecutionPriority,
} from "./executionTypes";

export type DecisionExecutionMappingInput = {
  organizationId: string;
  decisionId: string;
  title: string;
  description: string;
  priority?: ExecutionPriority;
};

export function mapDecisionToExecutionPlan(
  input: DecisionExecutionMappingInput,
): ExecutionPlan {
  const now = new Date();

  return {
    id: input.decisionId,
    organizationId: input.organizationId,
    title: input.title,
    description: input.description,
    status: "planned",
    priority: input.priority ?? "high",
    actions: [],
    createdAt: now,
    updatedAt: now,
  };
}