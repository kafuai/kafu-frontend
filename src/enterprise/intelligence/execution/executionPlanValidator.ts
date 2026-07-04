import { ExecutionPlan } from "./executionTypes";

export type ExecutionPlanValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateExecutionPlan(
  plan: ExecutionPlan,
): ExecutionPlanValidationResult {
  const errors: string[] = [];

  if (!plan.id) errors.push("Execution plan id is required.");
  if (!plan.organizationId) errors.push("Organization id is required.");
  if (!plan.title) errors.push("Execution plan title is required.");
  if (!plan.description) errors.push("Execution plan description is required.");
  if (!plan.priority) errors.push("Execution plan priority is required.");
  if (!plan.status) errors.push("Execution plan status is required.");

  return {
    valid: errors.length === 0,
    errors,
  };
}