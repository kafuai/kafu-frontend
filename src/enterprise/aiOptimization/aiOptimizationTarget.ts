import {
  AIOptimizationMetricSnapshot,
  AIOptimizationPriority,
  AIOptimizationTargetType,
} from "./aiOptimizationTypes";

export interface AIOptimizationTarget {
  id: string;
  organizationId: string;
  type: AIOptimizationTargetType;
  name: string;
  description: string;
  ownerTeam: string;
  priority: AIOptimizationPriority;
  currentMetrics: AIOptimizationMetricSnapshot;
  constraints: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAIOptimizationTargetInput {
  id: string;
  organizationId: string;
  type: AIOptimizationTargetType;
  name: string;
  description: string;
  ownerTeam: string;
  priority?: AIOptimizationPriority;
  currentMetrics?: AIOptimizationMetricSnapshot;
  constraints?: string[];
}

export function createAIOptimizationTarget(
  input: CreateAIOptimizationTargetInput,
): AIOptimizationTarget {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    type: input.type,
    name: input.name,
    description: input.description,
    ownerTeam: input.ownerTeam,
    priority: input.priority ?? "medium",
    currentMetrics: input.currentMetrics ?? {},
    constraints: input.constraints ?? [],
    createdAt: now,
    updatedAt: now,
  };
}

export function isCriticalOptimizationTarget(target: AIOptimizationTarget): boolean {
  return target.priority === "critical";
}