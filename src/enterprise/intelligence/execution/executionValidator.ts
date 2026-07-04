import { ExecutionPlan } from "./executionTypes";

export class ExecutionValidator {
  validate(plan: ExecutionPlan): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!plan.id) errors.push("Execution plan id is required.");
    if (!plan.organizationId) errors.push("Organization id is required.");
    if (!plan.title) errors.push("Execution plan title is required.");

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}