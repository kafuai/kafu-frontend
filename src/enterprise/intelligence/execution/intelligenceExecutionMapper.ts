import {
  ExecutionPlan,
  ExecutionPriority,
} from "./executionTypes";

export type IntelligenceExecutionMappingInput = {
  organizationId: string;
  intelligenceId: string;
  objective: string;
  recommendation: string;
  priority?: ExecutionPriority;
};

export function mapIntelligenceToExecutionPlan(
  input: IntelligenceExecutionMappingInput,
): ExecutionPlan {
  const now = new Date();

  return {
    id: input.intelligenceId,
    organizationId: input.organizationId,
    title: input.objective,
    description: input.recommendation,
    priority: input.priority ?? "medium",
    status: "planned",
    actions: [],
    createdAt: now,
    updatedAt: now,
  };
}