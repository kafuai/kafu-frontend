import {
  ExecutionActivationCheckpoint,
  ExecutionActivationDependency,
  ExecutionActivationGate,
  ExecutionActivationStatus,
} from "./executionActivationTypes";

export interface ExecutionActivationResult {
  organizationId: string;
  activationRequestId: string;
  executionId: string;
  authorizationRequestId: string;

  activationScore: number;
  confidenceScore: number;

  status: ExecutionActivationStatus;
  activated: boolean;

  passedGates: ExecutionActivationGate[];
  failedGates: ExecutionActivationGate[];

  completedCheckpoints: ExecutionActivationCheckpoint[];
  incompleteCheckpoints: ExecutionActivationCheckpoint[];

  resolvedDependencies: ExecutionActivationDependency[];
  unresolvedDependencies: ExecutionActivationDependency[];
  blockingDependencies: ExecutionActivationDependency[];

  activationMode: string;
  activatedAt?: string | null;

  requiresManualRelease: boolean;
  requiresContinuousMonitoring: boolean;
  rollbackEnabled: boolean;

  executiveSummary: string;
  recommendedAction: string;

  evaluatedAt: string;
}

export interface CreateExecutionActivationResultInput {
  organizationId: string;
  activationRequestId: string;
  executionId: string;
  authorizationRequestId: string;

  activationScore: number;
  confidenceScore: number;

  status: ExecutionActivationStatus;
  activated: boolean;

  passedGates?: ExecutionActivationGate[];
  failedGates?: ExecutionActivationGate[];

  completedCheckpoints?: ExecutionActivationCheckpoint[];
  incompleteCheckpoints?: ExecutionActivationCheckpoint[];

  resolvedDependencies?: ExecutionActivationDependency[];
  unresolvedDependencies?: ExecutionActivationDependency[];
  blockingDependencies?: ExecutionActivationDependency[];

  activationMode: string;
  activatedAt?: string | null;

  requiresManualRelease: boolean;
  requiresContinuousMonitoring: boolean;
  rollbackEnabled: boolean;

  executiveSummary: string;
  recommendedAction: string;

  evaluatedAt: string;
}

export function createExecutionActivationResult(
  input: CreateExecutionActivationResultInput,
): ExecutionActivationResult {
  return {
    organizationId: input.organizationId,
    activationRequestId: input.activationRequestId,
    executionId: input.executionId,
    authorizationRequestId: input.authorizationRequestId,

    activationScore: Math.max(
      0,
      Math.min(100, Math.round(input.activationScore)),
    ),
    confidenceScore: Math.max(
      0,
      Math.min(100, Math.round(input.confidenceScore)),
    ),

    status: input.status,
    activated: input.activated,

    passedGates: input.passedGates ?? [],
    failedGates: input.failedGates ?? [],

    completedCheckpoints:
      input.completedCheckpoints ?? [],
    incompleteCheckpoints:
      input.incompleteCheckpoints ?? [],

    resolvedDependencies:
      input.resolvedDependencies ?? [],
    unresolvedDependencies:
      input.unresolvedDependencies ?? [],
    blockingDependencies:
      input.blockingDependencies ?? [],

    activationMode: input.activationMode,
    activatedAt: input.activatedAt ?? null,

    requiresManualRelease:
      input.requiresManualRelease,
    requiresContinuousMonitoring:
      input.requiresContinuousMonitoring,
    rollbackEnabled:
      input.rollbackEnabled,

    executiveSummary: input.executiveSummary,
    recommendedAction: input.recommendedAction,

    evaluatedAt: input.evaluatedAt,
  };
}
