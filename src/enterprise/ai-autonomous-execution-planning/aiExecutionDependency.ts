import {
  AIExecutionPlanningAuditMetadata,
  AIExecutionStepDependencyType,
} from "./aiAutonomousExecutionPlanningTypes";

export interface AIExecutionDependency {
  stepId: string;
  dependsOnStepId: string;
  type: AIExecutionStepDependencyType;
  mandatory: boolean;
  reason: string;
  audit: AIExecutionPlanningAuditMetadata;
}

export function createAIExecutionDependency(input: {
  stepId: string;
  dependsOnStepId: string;
  type: AIExecutionStepDependencyType;
  mandatory?: boolean;
  reason: string;
  audit: AIExecutionPlanningAuditMetadata;
}): AIExecutionDependency {
  return {
    stepId: input.stepId,
    dependsOnStepId: input.dependsOnStepId,
    type: input.type,
    mandatory: input.mandatory ?? true,
    reason: input.reason,
    audit: input.audit,
  };
}