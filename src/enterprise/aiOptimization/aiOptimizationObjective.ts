import {
  AIOptimizationImpactLevel,
  AIOptimizationObjectiveType,
  AIOptimizationPriority,
} from "./aiOptimizationTypes";

export interface AIOptimizationObjective {
  id: string;
  organizationId: string;
  type: AIOptimizationObjectiveType;
  title: string;
  description: string;
  priority: AIOptimizationPriority;
  expectedImpact: AIOptimizationImpactLevel;
  minimumConfidence: number;
  successThreshold: number;
  createdAt: Date;
}

export interface CreateAIOptimizationObjectiveInput {
  id: string;
  organizationId: string;
  type: AIOptimizationObjectiveType;
  title: string;
  description: string;
  priority?: AIOptimizationPriority;
  expectedImpact?: AIOptimizationImpactLevel;
  minimumConfidence?: number;
  successThreshold?: number;
}

export function createAIOptimizationObjective(
  input: CreateAIOptimizationObjectiveInput,
): AIOptimizationObjective {
  return {
    id: input.id,
    organizationId: input.organizationId,
    type: input.type,
    title: input.title,
    description: input.description,
    priority: input.priority ?? "medium",
    expectedImpact: input.expectedImpact ?? "medium",
    minimumConfidence: input.minimumConfidence ?? 0.7,
    successThreshold: input.successThreshold ?? 0.8,
    createdAt: new Date(),
  };
}

export function rankAIOptimizationObjectives(
  objectives: AIOptimizationObjective[],
): AIOptimizationObjective[] {
  const priorityWeight: Record<AIOptimizationPriority, number> = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };

  return [...objectives].sort(
    (a, b) => priorityWeight[b.priority] - priorityWeight[a.priority],
  );
}