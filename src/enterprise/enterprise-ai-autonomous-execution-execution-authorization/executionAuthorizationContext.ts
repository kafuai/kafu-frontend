import {
  ExecutionAuthorizationCondition,
  ExecutionAuthorizationControl,
  ExecutionAuthorizationDependency,
  ExecutionAuthorizationPriority,
  ExecutionAuthorizationRiskLevel,
  ExecutionAuthorizationScope,
  ExecutionAuthorizationWindow,
} from "./executionAuthorizationTypes";

export interface ExecutionAuthorizationContext {
  organizationId: string;
  authorizationRequestId: string;
  executionId: string;
  decisionId: string;
  approvalRequestId?: string | null;

  executionTitle: string;
  executionSummary?: string | null;

  requestedBy: string;
  requestedAt: string;

  priority: ExecutionAuthorizationPriority;
  riskLevel: ExecutionAuthorizationRiskLevel;
  scope: ExecutionAuthorizationScope;

  executiveApprovalGranted: boolean;
  strategicAlignmentScore: number;
  approvalScore: number;
  executionReadinessScore: number;
  complianceScore: number;
  controlEffectivenessScore: number;
  dependencyReadinessScore: number;

  conditions: ExecutionAuthorizationCondition[];
  controls: ExecutionAuthorizationControl[];
  dependencies: ExecutionAuthorizationDependency[];

  policyIds: string[];
  approvalIds: string[];
  riskIds: string[];
  evidenceIds: string[];

  authorizationWindow?: ExecutionAuthorizationWindow | null;

  emergencyExecution: boolean;
  requiresContinuousMonitoring: boolean;
  requiresManualRelease: boolean;

  evaluatedAt: string;
}

export interface CreateExecutionAuthorizationContextInput {
  organizationId: string;
  authorizationRequestId: string;
  executionId: string;
  decisionId: string;
  approvalRequestId?: string | null;

  executionTitle: string;
  executionSummary?: string | null;

  requestedBy: string;
  requestedAt?: string;

  priority?: ExecutionAuthorizationPriority;
  riskLevel?: ExecutionAuthorizationRiskLevel;
  scope?: ExecutionAuthorizationScope;

  executiveApprovalGranted?: boolean;
  strategicAlignmentScore?: number;
  approvalScore?: number;
  executionReadinessScore?: number;
  complianceScore?: number;
  controlEffectivenessScore?: number;
  dependencyReadinessScore?: number;

  conditions?: ExecutionAuthorizationCondition[];
  controls?: ExecutionAuthorizationControl[];
  dependencies?: ExecutionAuthorizationDependency[];

  policyIds?: string[];
  approvalIds?: string[];
  riskIds?: string[];
  evidenceIds?: string[];

  authorizationWindow?: ExecutionAuthorizationWindow | null;

  emergencyExecution?: boolean;
  requiresContinuousMonitoring?: boolean;
  requiresManualRelease?: boolean;

  evaluatedAt?: string;
}

function normalizeScore(score: number | undefined): number {
  if (score === undefined || Number.isNaN(score)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function createExecutionAuthorizationContext(
  input: CreateExecutionAuthorizationContextInput,
): ExecutionAuthorizationContext {
  const now = new Date().toISOString();

  return {
    organizationId: input.organizationId,
    authorizationRequestId: input.authorizationRequestId,
    executionId: input.executionId,
    decisionId: input.decisionId,
    approvalRequestId: input.approvalRequestId ?? null,

    executionTitle: input.executionTitle,
    executionSummary: input.executionSummary ?? null,

    requestedBy: input.requestedBy,
    requestedAt: input.requestedAt ?? now,

    priority: input.priority ?? "medium",
    riskLevel: input.riskLevel ?? "moderate",
    scope: input.scope ?? "workflow",

    executiveApprovalGranted:
      input.executiveApprovalGranted ?? false,
    strategicAlignmentScore: normalizeScore(
      input.strategicAlignmentScore,
    ),
    approvalScore: normalizeScore(
      input.approvalScore,
    ),
    executionReadinessScore: normalizeScore(
      input.executionReadinessScore,
    ),
    complianceScore: normalizeScore(
      input.complianceScore,
    ),
    controlEffectivenessScore: normalizeScore(
      input.controlEffectivenessScore,
    ),
    dependencyReadinessScore: normalizeScore(
      input.dependencyReadinessScore,
    ),

    conditions: input.conditions ?? [],
    controls: input.controls ?? [],
    dependencies: input.dependencies ?? [],

    policyIds: input.policyIds ?? [],
    approvalIds: input.approvalIds ?? [],
    riskIds: input.riskIds ?? [],
    evidenceIds: input.evidenceIds ?? [],

    authorizationWindow:
      input.authorizationWindow ?? null,

    emergencyExecution:
      input.emergencyExecution ?? false,
    requiresContinuousMonitoring:
      input.requiresContinuousMonitoring ?? true,
    requiresManualRelease:
      input.requiresManualRelease ?? false,

    evaluatedAt: input.evaluatedAt ?? now,
  };
}
