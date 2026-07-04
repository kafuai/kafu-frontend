import { BudgetPolicy } from "./budgetPolicy";

export type BudgetValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateBudgetPolicy(
  policy: BudgetPolicy,
): BudgetValidationResult {
  const errors: string[] = [];

  if (!policy.id) {
    errors.push("Budget policy id is required.");
  }

  if (!policy.organizationId) {
    errors.push("Organization id is required.");
  }

  if (!policy.name) {
    errors.push("Budget policy name is required.");
  }

  if (policy.limit <= 0) {
    errors.push("Budget limit must be greater than zero.");
  }

  if (
    policy.warningThreshold < 0 ||
    policy.warningThreshold > 1
  ) {
    errors.push("Warning threshold must be between 0 and 1.");
  }

  if (
    policy.criticalThreshold < 0 ||
    policy.criticalThreshold > 1
  ) {
    errors.push("Critical threshold must be between 0 and 1.");
  }

  if (policy.warningThreshold > policy.criticalThreshold) {
    errors.push(
      "Warning threshold cannot be greater than critical threshold.",
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}