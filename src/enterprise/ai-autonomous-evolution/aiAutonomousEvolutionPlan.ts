import {
  AIAutonomousEvolutionPriority,
  AIAutonomousEvolutionScope,
} from "./aiAutonomousEvolutionTypes";

export interface AIAutonomousEvolutionPlanStep {
  id: string;
  title: string;
  description: string;
  capabilityId?: string;
  requiredApproval: boolean;
  rollbackAction: string;
  order: number;
}

export interface AIAutonomousEvolutionPlan {
  id: string;
  candidateId: string;
  organizationId: string;
  scope: AIAutonomousEvolutionScope;
  priority: AIAutonomousEvolutionPriority;
  objective: string;
  steps: AIAutonomousEvolutionPlanStep[];
  rollbackPlan: string[];
  successCriteria: string[];
  createdAt: Date;
}

export interface CreateAIAutonomousEvolutionPlanInput {
  id: string;
  candidateId: string;
  organizationId: string;
  scope: AIAutonomousEvolutionScope;
  priority: AIAutonomousEvolutionPriority;
  objective: string;
  steps?: AIAutonomousEvolutionPlanStep[];
  rollbackPlan?: string[];
  successCriteria?: string[];
  createdAt?: Date;
}

export function createAIAutonomousEvolutionPlan(
  input: CreateAIAutonomousEvolutionPlanInput,
): AIAutonomousEvolutionPlan {
  return {
    id: input.id,
    candidateId: input.candidateId,
    organizationId: input.organizationId,
    scope: input.scope,
    priority: input.priority,
    objective: input.objective,
    steps: input.steps ?? [],
    rollbackPlan: input.rollbackPlan ?? [],
    successCriteria: input.successCriteria ?? [],
    createdAt: input.createdAt ?? new Date(),
  };
}

export function sortAIAutonomousEvolutionPlanSteps(
  steps: AIAutonomousEvolutionPlanStep[],
): AIAutonomousEvolutionPlanStep[] {
  return [...steps].sort((first, second) => first.order - second.order);
}