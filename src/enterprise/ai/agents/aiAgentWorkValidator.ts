import {
  AIAgentGoal,
  AIAgentPlan,
  AIAgentTask,
} from "./aiAgentWorkTypes";

export interface AIAgentWorkValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateAIAgentGoal(
  goal: AIAgentGoal,
): AIAgentWorkValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!goal.id.trim()) errors.push("Goal id is required.");
  if (!goal.agentId.trim()) errors.push("Agent id is required.");
  if (!goal.organizationId.trim()) errors.push("Organization id is required.");
  if (!goal.title.trim()) errors.push("Goal title is required.");
  if (!goal.description.trim()) errors.push("Goal description is required.");

  if (goal.successCriteria.length === 0) {
    warnings.push("Goal has no success criteria.");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateAIAgentTask(
  task: AIAgentTask,
): AIAgentWorkValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!task.id.trim()) errors.push("Task id is required.");
  if (!task.goalId.trim()) errors.push("Goal id is required.");
  if (!task.agentId.trim()) errors.push("Agent id is required.");
  if (!task.organizationId.trim()) errors.push("Organization id is required.");
  if (!task.title.trim()) errors.push("Task title is required.");
  if (!task.description.trim()) errors.push("Task description is required.");
  if (!task.expectedOutcome.trim()) {
    errors.push("Task expected outcome is required.");
  }

  if (task.requiredCapabilities.length === 0) {
    warnings.push("Task has no required capabilities.");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateAIAgentPlan(
  plan: AIAgentPlan,
): AIAgentWorkValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!plan.id.trim()) errors.push("Plan id is required.");
  if (!plan.goalId.trim()) errors.push("Goal id is required.");
  if (!plan.agentId.trim()) errors.push("Agent id is required.");
  if (!plan.organizationId.trim()) {
    errors.push("Organization id is required.");
  }

  if (plan.steps.length === 0) {
    errors.push("Plan requires at least one step.");
  }

  const orders = new Set<number>();

  for (const step of plan.steps) {
    if (!step.id.trim()) errors.push("Plan step id is required.");
    if (!step.taskId.trim()) errors.push("Plan step task id is required.");
    if (!step.title.trim()) errors.push("Plan step title is required.");

    if (orders.has(step.order)) {
      errors.push(`Duplicate plan step order: ${step.order}`);
    }

    orders.add(step.order);
  }

  if (plan.approvalRequired && plan.riskNotes.length === 0) {
    warnings.push("Approval-required plan has no risk notes.");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}