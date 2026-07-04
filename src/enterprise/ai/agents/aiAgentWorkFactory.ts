import {
  AIAgentGoal,
  AIAgentPlan,
  AIAgentTask,
  CreateAIAgentGoalInput,
  CreateAIAgentPlanInput,
  CreateAIAgentTaskInput,
} from "./aiAgentWorkTypes";

export function createAIAgentGoal(
  input: CreateAIAgentGoalInput,
): AIAgentGoal {
  const now = new Date();

  return {
    id: input.id,
    agentId: input.agentId,
    organizationId: input.organizationId,
    title: input.title,
    description: input.description,
    status: "open",
    successCriteria: input.successCriteria ?? [],
    constraints: input.constraints ?? [],
    createdAt: now,
    updatedAt: now,
  };
}

export function createAIAgentTask(
  input: CreateAIAgentTaskInput,
): AIAgentTask {
  const now = new Date();

  return {
    id: input.id,
    goalId: input.goalId,
    agentId: input.agentId,
    organizationId: input.organizationId,
    title: input.title,
    description: input.description,
    priority: input.priority,
    status: "queued",
    requiredCapabilities: input.requiredCapabilities ?? [],
    dependencies: input.dependencies ?? [],
    expectedOutcome: input.expectedOutcome,
    createdAt: now,
    updatedAt: now,
  };
}

export function createAIAgentPlan(
  input: CreateAIAgentPlanInput,
): AIAgentPlan {
  const now = new Date();

  return {
    id: input.id,
    goalId: input.goalId,
    agentId: input.agentId,
    organizationId: input.organizationId,
    status: "draft",
    steps: input.steps,
    riskNotes: input.riskNotes ?? [],
    approvalRequired:
      input.approvalRequired ??
      input.steps.some((step) => step.requiresApproval),
    createdAt: now,
    updatedAt: now,
  };
}