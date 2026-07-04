import { AIDecisionCriterionType } from "./aiAutonomousDecisionTypes";

export interface AIDecisionCriterion {
  id: string;
  type: AIDecisionCriterionType;
  name: string;
  description: string;
  weight: number;
  required: boolean;
}

export interface CreateAIDecisionCriterionInput {
  id: string;
  type: AIDecisionCriterionType;
  name: string;
  description: string;
  weight: number;
  required?: boolean;
}

export function createAIDecisionCriterion(
  input: CreateAIDecisionCriterionInput,
): AIDecisionCriterion {
  return {
    ...input,
    required: input.required ?? false,
  };
}

export function normalizeAIDecisionCriteriaWeights(
  criteria: AIDecisionCriterion[],
): AIDecisionCriterion[] {
  const totalWeight = criteria.reduce((sum, criterion) => sum + criterion.weight, 0);

  if (totalWeight <= 0) {
    return criteria;
  }

  return criteria.map((criterion) => ({
    ...criterion,
    weight: criterion.weight / totalWeight,
  }));
}