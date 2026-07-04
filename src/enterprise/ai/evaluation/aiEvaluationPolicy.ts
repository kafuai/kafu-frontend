import {
  AIEvaluationCriterion,
  AIEvaluationRiskLevel,
} from "./aiEvaluationTypes";

export interface AIEvaluationPolicy {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  minimumOverallScore: number;
  maximumAllowedRiskLevel: AIEvaluationRiskLevel;
  requiredCriterionIds: string[];
  blockOnRequiredFailure: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAIEvaluationPolicyInput {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  minimumOverallScore: number;
  maximumAllowedRiskLevel: AIEvaluationRiskLevel;
  requiredCriterionIds?: string[];
  blockOnRequiredFailure?: boolean;
}

const riskRank: Record<AIEvaluationRiskLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export function createAIEvaluationPolicy(
  input: CreateAIEvaluationPolicyInput,
): AIEvaluationPolicy {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    name: input.name,
    description: input.description,
    minimumOverallScore: input.minimumOverallScore,
    maximumAllowedRiskLevel: input.maximumAllowedRiskLevel,
    requiredCriterionIds: input.requiredCriterionIds ?? [],
    blockOnRequiredFailure: input.blockOnRequiredFailure ?? true,
    createdAt: now,
    updatedAt: now,
  };
}

export function isRiskAllowedByEvaluationPolicy(
  riskLevel: AIEvaluationRiskLevel,
  policy: AIEvaluationPolicy,
): boolean {
  return riskRank[riskLevel] <= riskRank[policy.maximumAllowedRiskLevel];
}

export function resolveRequiredEvaluationCriteria(
  criteria: AIEvaluationCriterion[],
  policy: AIEvaluationPolicy,
): AIEvaluationCriterion[] {
  const requiredIds = new Set(policy.requiredCriterionIds);

  return criteria.filter(
    (criterion) => criterion.isRequired || requiredIds.has(criterion.id),
  );
}