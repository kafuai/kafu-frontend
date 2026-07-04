import { AIAutonomousExecutionTask } from "./aiAutonomousExecutionTask";
import {
  AIAutonomousExecutionPriority,
  AIAutonomousExecutionRiskLevel,
  AIAutonomousExecutionStatus,
} from "./aiAutonomousExecutionTypes";

export interface AIAutonomousExecutionPlan {
  id: string;
  organizationId: string;
  objective: string;
  description: string;
  createdByAgentId: string;
  priority: AIAutonomousExecutionPriority;
  riskLevel: AIAutonomousExecutionRiskLevel;
  status: AIAutonomousExecutionStatus;
  tasks: AIAutonomousExecutionTask[];
  successCriteria: string[];
  constraints: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAIAutonomousExecutionPlanInput {
  id: string;
  organizationId: string;
  objective: string;
  description: string;
  createdByAgentId: string;
  priority?: AIAutonomousExecutionPriority;
  riskLevel?: AIAutonomousExecutionRiskLevel;
  tasks?: AIAutonomousExecutionTask[];
  successCriteria?: string[];
  constraints?: string[];
  createdAt?: Date;
}

export function createAIAutonomousExecutionPlan(
  input: CreateAIAutonomousExecutionPlanInput,
): AIAutonomousExecutionPlan {
  const now = input.createdAt ?? new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    objective: input.objective,
    description: input.description,
    createdByAgentId: input.createdByAgentId,
    priority: input.priority ?? "medium",
    riskLevel: input.riskLevel ?? "medium",
    status: "draft",
    tasks: input.tasks ?? [],
    successCriteria: input.successCriteria ?? [],
    constraints: input.constraints ?? [],
    createdAt: now,
    updatedAt: now,
  };
}

export function addAIAutonomousExecutionTaskToPlan(
  plan: AIAutonomousExecutionPlan,
  task: AIAutonomousExecutionTask,
): AIAutonomousExecutionPlan {
  return {
    ...plan,
    tasks: [...plan.tasks, task],
    updatedAt: new Date(),
  };
}

export function markAIAutonomousExecutionPlanStatus(
  plan: AIAutonomousExecutionPlan,
  status: AIAutonomousExecutionStatus,
): AIAutonomousExecutionPlan {
  return {
    ...plan,
    status,
    updatedAt: new Date(),
  };
}