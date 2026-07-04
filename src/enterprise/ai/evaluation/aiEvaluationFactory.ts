import {
  AIEvaluationCriterion,
  AIEvaluationRun,
  AIEvaluationRubric,
  CreateAIEvaluationCriterionInput,
  CreateAIEvaluationRubricInput,
  CreateAIEvaluationRunInput,
} from "./aiEvaluationTypes";

export function createAIEvaluationCriterion(
  input: CreateAIEvaluationCriterionInput,
): AIEvaluationCriterion {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    name: input.name,
    description: input.description,
    type: input.type,
    weight: input.weight,
    minimumScore: input.minimumScore,
    maximumScore: input.maximumScore,
    passingScore: input.passingScore,
    isRequired: input.isRequired ?? false,
    createdAt: now,
    updatedAt: now,
  };
}

export function createAIEvaluationRubric(
  input: CreateAIEvaluationRubricInput,
): AIEvaluationRubric {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    criterionId: input.criterionId,
    name: input.name,
    description: input.description,
    levels: input.levels,
    createdAt: now,
    updatedAt: now,
  };
}

export function createAIEvaluationRun(
  input: CreateAIEvaluationRunInput,
): AIEvaluationRun {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    name: input.name,
    description: input.description,
    target: input.target,
    status: "draft",
    criteria: input.criteria,
    samples: input.samples,
    results: [],
    createdAt: now,
    updatedAt: now,
  };
}