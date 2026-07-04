import { AIAutonomousExecutionPlan } from "./aiAutonomousExecutionPlan";
import { AIAutonomousExecutionPolicy } from "./aiAutonomousExecutionPolicy";
import { AIAutonomousExecutionTask } from "./aiAutonomousExecutionTask";

export function validateAIAutonomousExecutionTask(
  task: AIAutonomousExecutionTask,
): void {
  if (!task.id.trim()) {
    throw new Error("Autonomous execution task id is required.");
  }

  if (!task.organizationId.trim()) {
    throw new Error("Organization id is required.");
  }

  if (!task.planId.trim()) {
    throw new Error("Plan id is required.");
  }

  if (!task.capabilityId.trim()) {
    throw new Error("Capability id is required.");
  }

  if (!task.requestedByAgentId.trim()) {
    throw new Error("Requesting agent id is required.");
  }
}

export function validateAIAutonomousExecutionPlan(
  plan: AIAutonomousExecutionPlan,
): void {
  if (!plan.id.trim()) {
    throw new Error("Execution plan id is required.");
  }

  if (!plan.organizationId.trim()) {
    throw new Error("Organization id is required.");
  }

  if (!plan.objective.trim()) {
    throw new Error("Execution objective is required.");
  }

  for (const task of plan.tasks) {
    validateAIAutonomousExecutionTask(task);
  }
}

export function validateAIAutonomousExecutionPolicy(
  policy: AIAutonomousExecutionPolicy,
): void {
  if (!policy.id.trim()) {
    throw new Error("Policy id is required.");
  }

  if (!policy.organizationId.trim()) {
    throw new Error("Organization id is required.");
  }

  if (!policy.name.trim()) {
    throw new Error("Policy name is required.");
  }
}