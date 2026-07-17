import {
  ExecutionAuthorizationCondition,
  ExecutionAuthorizationControl,
  ExecutionAuthorizationDependency,
  ExecutionAuthorizationStatus,
} from "./executionAuthorizationTypes";

export interface ExecutionAuthorizationResult {
  organizationId: string;
  authorizationRequestId: string;
  executionId: string;
  decisionId: string;

  authorizationScore: number;
  confidenceScore: number;

  status: ExecutionAuthorizationStatus;
  authorized: boolean;

  passedControls: ExecutionAuthorizationControl[];
  failedControls: ExecutionAuthorizationControl[];

  satisfiedConditions: ExecutionAuthorizationCondition[];
  unsatisfiedConditions: ExecutionAuthorizationCondition[];
  blockingConditions: ExecutionAuthorizationCondition[];

  resolvedDependencies: ExecutionAuthorizationDependency[];
  unresolvedDependencies: ExecutionAuthorizationDependency[];
  blockingDependencies: ExecutionAuthorizationDependency[];

  validFrom: string;
  validUntil?: string | null;

  requiresContinuousMonitoring: boolean;
  requiresManualRelease: boolean;

  executiveSummary: string;
  recommendedAction: string;

  evaluatedAt: string;
}

export interface CreateExecutionAuthorizationResultInput {
  organizationId: string;
  authorizationRequestId: string;
  executionId: string;
  decisionId: string;

  authorizationScore: number;
  confidenceScore: number;

  status: ExecutionAuthorizationStatus;
  authorized: boolean;

  passedControls?: ExecutionAuthorizationControl[];
  failedControls?: ExecutionAuthorizationControl[];

  satisfiedConditions?: ExecutionAuthorizationCondition[];
  unsatisfiedConditions?: ExecutionAuthorizationCondition[];
  blockingConditions?: ExecutionAuthorizationCondition[];

  resolvedDependencies?: ExecutionAuthorizationDependency[];
  unresolvedDependencies?: ExecutionAuthorizationDependency[];
  blockingDependencies?: ExecutionAuthorizationDependency[];

  validFrom: string;
  validUntil?: string | null;

  requiresContinuousMonitoring: boolean;
  requiresManualRelease: boolean;

  executiveSummary: string;
  recommendedAction: string;

  evaluatedAt: string;
}

export function createExecutionAuthorizationResult(
  input: CreateExecutionAuthorizationResultInput,
): ExecutionAuthorizationResult {
  return {
    organizationId: input.organizationId,
    authorizationRequestId: input.authorizationRequestId,
    executionId: input.executionId,
    decisionId: input.decisionId,

    authorizationScore: Math.max(
      0,
      Math.min(100, Math.round(input.authorizationScore)),
    ),
    confidenceScore: Math.max(
      0,
      Math.min(100, Math.round(input.confidenceScore)),
    ),

    status: input.status,
    authorized: input.authorized,

    passedControls: input.passedControls ?? [],
    failedControls: input.failedControls ?? [],

    satisfiedConditions: input.satisfiedConditions ?? [],
    unsatisfiedConditions: input.unsatisfiedConditions ?? [],
    blockingConditions: input.blockingConditions ?? [],

    resolvedDependencies: input.resolvedDependencies ?? [],
    unresolvedDependencies: input.unresolvedDependencies ?? [],
    blockingDependencies: input.blockingDependencies ?? [],

    validFrom: input.validFrom,
    validUntil: input.validUntil ?? null,

    requiresContinuousMonitoring:
      input.requiresContinuousMonitoring,
    requiresManualRelease:
      input.requiresManualRelease,

    executiveSummary: input.executiveSummary,
    recommendedAction: input.recommendedAction,

    evaluatedAt: input.evaluatedAt,
  };
}
