import {
  AIExecutionPlanningAuditMetadata,
  AIExecutionPlanningPriority,
  AIExecutionPlanningStatus,
} from "./aiAutonomousExecutionPlanningTypes";

export interface AIExecutionObjective {
  id: string;
  title: string;
  description: string;
  decisionId?: string;
  priority: AIExecutionPlanningPriority;
  status: AIExecutionPlanningStatus;
  expectedOutcome: string;
  successCriteria: string[];
  constraints: string[];
  audit: AIExecutionPlanningAuditMetadata;
}

export function createAIExecutionObjective(input: {
  id: string;
  title: string;
  description: string;
  decisionId?: string;
  priority?: AIExecutionPlanningPriority;
  expectedOutcome: string;
  successCriteria?: string[];
  constraints?: string[];
  audit: AIExecutionPlanningAuditMetadata;
}): AIExecutionObjective {
  return {
    id: input.id,
    title: input.title,
    description: input.description,
    decisionId: input.decisionId,
    priority: input.priority ?? "medium",
    status: "draft",
    expectedOutcome: input.expectedOutcome,
    successCriteria: input.successCriteria ?? [],
    constraints: input.constraints ?? [],
    audit: input.audit,
  };
}

export function markAIExecutionObjectiveReady(
  objective: AIExecutionObjective,
): AIExecutionObjective {
  return {
    ...objective,
    status: "ready",
    audit: {
      ...objective.audit,
      updatedAt: new Date(),
    },
  };
}