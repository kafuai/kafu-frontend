import { BudgetPolicy } from "./budgetPolicy";
import {
  BudgetTrackingSnapshot,
  trackBudget,
} from "./budgetTracking";
import {
  BudgetValidationResult,
  validateBudgetPolicy,
} from "./budgetValidator";

export type BudgetEvaluationResult = {
  validation: BudgetValidationResult;
  tracking?: BudgetTrackingSnapshot;
};

export function evaluateBudget(
  policy: BudgetPolicy,
  currentSpend: number,
): BudgetEvaluationResult {
  const validation = validateBudgetPolicy(policy);

  if (!validation.valid) {
    return {
      validation,
    };
  }

  return {
    validation,
    tracking: trackBudget(policy, currentSpend),
  };
}