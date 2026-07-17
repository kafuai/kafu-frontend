import {
  ExecutionInterventionType,
  ExecutionSupervisionIntervention,
  ExecutionSupervisionSeverity,
  ExecutionSupervisionStatus,
} from "./executionSupervisionTypes";

export interface ExecutionSupervisionResult {
  organizationId: string;
  supervisionRequestId: string;
  executionId: string;

  supervisionScore: number;
  confidenceScore: number;

  status: ExecutionSupervisionStatus;
  severity: ExecutionSupervisionSeverity;

  progressVariance: number;

  activeSignals: number;
  criticalSignals: number;
  blockingConstraints: number;
  overdueCheckpoints: number;
  nonCompliantPolicies: number;

  recommendedIntervention:
    ExecutionSupervisionIntervention;

  interventionType: ExecutionInterventionType;
  autonomousInterventionAllowed: boolean;

  executiveSummary: string;
  recommendedAction: string;

  evaluatedAt: string;
}

export interface CreateExecutionSupervisionResultInput {
  organizationId: string;
  supervisionRequestId: string;
  executionId: string;

  supervisionScore: number;
  confidenceScore: number;

  status: ExecutionSupervisionStatus;
  severity: ExecutionSupervisionSeverity;

  progressVariance: number;

  activeSignals: number;
  criticalSignals: number;
  blockingConstraints: number;
  overdueCheckpoints: number;
  nonCompliantPolicies: number;

  recommendedIntervention:
    ExecutionSupervisionIntervention;

  interventionType: ExecutionInterventionType;
  autonomousInterventionAllowed: boolean;

  executiveSummary: string;
  recommendedAction: string;

  evaluatedAt: string;
}

export function createExecutionSupervisionResult(
  input: CreateExecutionSupervisionResultInput,
): ExecutionSupervisionResult {
  return {
    organizationId: input.organizationId,
    supervisionRequestId:
      input.supervisionRequestId,
    executionId: input.executionId,

    supervisionScore: Math.max(
      0,
      Math.min(
        100,
        Math.round(input.supervisionScore),
      ),
    ),

    confidenceScore: Math.max(
      0,
      Math.min(
        100,
        Math.round(input.confidenceScore),
      ),
    ),

    status: input.status,
    severity: input.severity,

    progressVariance: Math.round(
      input.progressVariance,
    ),

    activeSignals: Math.max(
      0,
      input.activeSignals,
    ),

    criticalSignals: Math.max(
      0,
      input.criticalSignals,
    ),

    blockingConstraints: Math.max(
      0,
      input.blockingConstraints,
    ),

    overdueCheckpoints: Math.max(
      0,
      input.overdueCheckpoints,
    ),

    nonCompliantPolicies: Math.max(
      0,
      input.nonCompliantPolicies,
    ),

    recommendedIntervention:
      input.recommendedIntervention,

    interventionType:
      input.interventionType,

    autonomousInterventionAllowed:
      input.autonomousInterventionAllowed,

    executiveSummary:
      input.executiveSummary,

    recommendedAction:
      input.recommendedAction,

    evaluatedAt:
      input.evaluatedAt,
  };
}
