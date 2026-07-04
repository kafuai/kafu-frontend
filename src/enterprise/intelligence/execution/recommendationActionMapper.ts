import {
  ExecutionAction,
  ExecutionPriority,
  ExecutionRiskLevel,
} from "./executionTypes";

export type RecommendationActionMappingInput = {
  recommendationId: string;
  title: string;
  description: string;
  priority?: ExecutionPriority;
  riskLevel?: ExecutionRiskLevel;
  estimatedImpact?: string;
  owner?: string;
  dependencies?: string[];
};

export function mapRecommendationToExecutionAction(
  input: RecommendationActionMappingInput,
): ExecutionAction {
  return {
    id: input.recommendationId,
    type: "recommendation",
    title: input.title,
    description: input.description,
    priority: input.priority ?? "medium",
    riskLevel: input.riskLevel ?? "medium",
    estimatedImpact: input.estimatedImpact,
    owner: input.owner,
    dependencies: input.dependencies,
  };
}