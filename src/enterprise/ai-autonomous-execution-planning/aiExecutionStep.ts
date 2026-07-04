import {
  AIExecutionPlanningAuditMetadata,
  AIExecutionPlanningPriority,
  AIExecutionPlanningRiskLevel,
  AIExecutionPlanningStatus,
  AIExecutionStepType,
} from "./aiAutonomousExecutionPlanningTypes";

export interface AIExecutionStep {
  id: string;
  objectiveId: string;
  title: string;
  description: string;
  type: AIExecutionStepType;
  priority: AIExecutionPlanningPriority;
  status: AIExecutionPlanningStatus;
  riskLevel: AIExecutionPlanningRiskLevel;
  estimatedEffort: number;
  requiredCapabilities: string[];
  expectedOutput: string;
  audit: AIExecutionPlanningAuditMetadata;
}

export function createAIExecutionStep(input: {
  id: string;
  objectiveId: string;
  title: string;
  description: string;
  type: AIExecutionStepType;
  priority?: AIExecutionPlanningPriority;
  riskLevel?: AIExecutionPlanningRiskLevel;
  estimatedEffort?: number;
  requiredCapabilities?: string[];
  expectedOutput: string;
  audit: AIExecutionPlanningAuditMetadata;
}): AIExecutionStep {
  return {
    id: input.id,
    objectiveId: input.objectiveId,
    title: input.title,
    description: input.description,
    type: input.type,
    priority: input.priority ?? "medium",
    status: "draft",
    riskLevel: input.riskLevel ?? "low",
    estimatedEffort: input.estimatedEffort ?? 1,
    requiredCapabilities: input.requiredCapabilities ?? [],
    expectedOutput: input.expectedOutput,
    audit: input.audit,
  };
}

export function markAIExecutionStepReady(step: AIExecutionStep): AIExecutionStep {
  return {
    ...step,
    status: "ready",
    audit: {
      ...step.audit,
      updatedAt: new Date(),
    },
  };
}