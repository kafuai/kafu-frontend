import {
  AIEvaluationCriterion,
  AIEvaluationRun,
} from "./aiEvaluationTypes";

export function validateEvaluationCriteria(
  criteria: AIEvaluationCriterion[],
): void {
  if (criteria.length === 0) {
    throw new Error("Evaluation must contain at least one criterion.");
  }

  for (const criterion of criteria) {
    if (criterion.weight <= 0) {
      throw new Error(
        `Criterion "${criterion.name}" has an invalid weight.`,
      );
    }

    if (criterion.maximumScore <= criterion.minimumScore) {
      throw new Error(
        `Criterion "${criterion.name}" has invalid score limits.`,
      );
    }

    if (
      criterion.passingScore < criterion.minimumScore ||
      criterion.passingScore > criterion.maximumScore
    ) {
      throw new Error(
        `Criterion "${criterion.name}" has an invalid passing score.`,
      );
    }
  }
}

export function validateEvaluationRun(
  run: AIEvaluationRun,
): void {
  validateEvaluationCriteria(run.criteria);

  if (run.samples.length === 0) {
    throw new Error(
      "Evaluation run requires at least one evaluation sample.",
    );
  }
}