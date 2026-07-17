import { CustomerActivationPlan } from "./customerActivationPlan";
import { CustomerActivationMilestone } from "./customerActivationMilestones";

export interface CustomerActivationValidationInput {
  plan: CustomerActivationPlan;
  milestones: CustomerActivationMilestone[];
}

export function validateCustomerActivation(
  input: CustomerActivationValidationInput,
): string[] {
  const issues: string[] = [];

  if (!input.plan.organizationId.trim()) {
    issues.push("Organization ID is required.");
  }

  if (!input.plan.activationOwner.trim()) {
    issues.push("Activation owner is required.");
  }

  if (input.plan.objectives.length === 0) {
    issues.push("At least one activation objective is required.");
  }

  if (input.plan.requiredActions.length === 0) {
    issues.push("At least one activation action is required.");
  }

  if (input.milestones.length === 0) {
    issues.push("At least one activation milestone is required.");
  }

  if (input.milestones.some((milestone) => !milestone.owner.trim())) {
    issues.push("Every activation milestone must have an owner.");
  }

  return issues;
}
