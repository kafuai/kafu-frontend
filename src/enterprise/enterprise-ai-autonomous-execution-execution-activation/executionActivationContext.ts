import {
  ExecutionActivationCheckpoint,
  ExecutionActivationDependency,
  ExecutionActivationGate,
  ExecutionActivationMode,
  ExecutionActivationPriority,
  ExecutionActivationScope,
  ExecutionActivationWindow,
} from "./executionActivationTypes";

export interface ExecutionActivationContext {
  organizationId: string;
  activationRequestId: string;
  executionId: string;
  authorizationRequestId: string;

  executionTitle: string;
  executionSummary?: string | null;

  requestedBy: string;
  requestedAt: string;

  priority: ExecutionActivationPriority;
  mode: ExecutionActivationMode;
  scope: ExecutionActivationScope;

  executionAuthorized: boolean;
  authorizationScore: number;
  executionReadinessScore: number;
  resourceReadinessScore: number;
  operationalReadinessScore: number;
  monitoringReadinessScore: number;
  rollbackReadinessScore: number;

  gates: ExecutionActivationGate[];
  dependencies: ExecutionActivationDependency[];
  checkpoints: ExecutionActivationCheckpoint[];

  policyIds: string[];
  authorizationIds: string[];
  resourceIds: string[];
  monitoringIds: string[];
  rollbackPlanIds: string[];

  activationWindow?: ExecutionActivationWindow | null;

  requiresManualRelease: boolean;
  requiresContinuousMonitoring: boolean;
  rollbackEnabled: boolean;

  evaluatedAt: string;
}

export interface CreateExecutionActivationContextInput {
  organizationId: string;
  activationRequestId: string;
  executionId: string;
  authorizationRequestId: string;

  executionTitle: string;
  executionSummary?: string | null;

  requestedBy: string;
  requestedAt?: string;

  priority?: ExecutionActivationPriority;
  mode?: ExecutionActivationMode;
  scope?: ExecutionActivationScope;

  executionAuthorized?: boolean;
  authorizationScore?: number;
  executionReadinessScore?: number;
  resourceReadinessScore?: number;
  operationalReadinessScore?: number;
  monitoringReadinessScore?: number;
  rollbackReadinessScore?: number;

  gates?: ExecutionActivationGate[];
  dependencies?: ExecutionActivationDependency[];
  checkpoints?: ExecutionActivationCheckpoint[];

  policyIds?: string[];
  authorizationIds?: string[];
  resourceIds?: string[];
  monitoringIds?: string[];
  rollbackPlanIds?: string[];

  activationWindow?: ExecutionActivationWindow | null;

  requiresManualRelease?: boolean;
  requiresContinuousMonitoring?: boolean;
  rollbackEnabled?: boolean;

  evaluatedAt?: string;
}

function normalizeScore(score: number | undefined): number {
  if (score === undefined || Number.isNaN(score)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function createExecutionActivationContext(
  input: CreateExecutionActivationContextInput,
): ExecutionActivationContext {
  const now = new Date().toISOString();

  return {
    organizationId: input.organizationId,
    activationRequestId: input.activationRequestId,
    executionId: input.executionId,
    authorizationRequestId: input.authorizationRequestId,

    executionTitle: input.executionTitle,
    executionSummary: input.executionSummary ?? null,

    requestedBy: input.requestedBy,
    requestedAt: input.requestedAt ?? now,

    priority: input.priority ?? "medium",
    mode: input.mode ?? "immediate",
    scope: input.scope ?? "workflow",

    executionAuthorized:
      input.executionAuthorized ?? false,
    authorizationScore: normalizeScore(
      input.authorizationScore,
    ),
    executionReadinessScore: normalizeScore(
      input.executionReadinessScore,
    ),
    resourceReadinessScore: normalizeScore(
      input.resourceReadinessScore,
    ),
    operationalReadinessScore: normalizeScore(
      input.operationalReadinessScore,
    ),
    monitoringReadinessScore: normalizeScore(
      input.monitoringReadinessScore,
    ),
    rollbackReadinessScore: normalizeScore(
      input.rollbackReadinessScore,
    ),

    gates: input.gates ?? [],
    dependencies: input.dependencies ?? [],
    checkpoints: input.checkpoints ?? [],

    policyIds: input.policyIds ?? [],
    authorizationIds: input.authorizationIds ?? [],
    resourceIds: input.resourceIds ?? [],
    monitoringIds: input.monitoringIds ?? [],
    rollbackPlanIds: input.rollbackPlanIds ?? [],

    activationWindow:
      input.activationWindow ?? null,

    requiresManualRelease:
      input.requiresManualRelease ?? false,
    requiresContinuousMonitoring:
      input.requiresContinuousMonitoring ?? true,
    rollbackEnabled:
      input.rollbackEnabled ?? true,

    evaluatedAt: input.evaluatedAt ?? now,
  };
}
