import {
  ExecutionSupervisionCheckpoint,
  ExecutionSupervisionConstraint,
  ExecutionSupervisionPolicy,
  ExecutionSupervisionSignal,
} from "./executionSupervisionTypes";

export interface ExecutionSupervisionContext {
  organizationId: string;
  supervisionRequestId: string;
  executionId: string;
  executionTitle: string;

  executionOwner?: string | null;
  executionStartedAt: string;
  expectedCompletionAt?: string | null;

  currentProgress: number;
  expectedProgress: number;

  executionHealthScore: number;
  performanceScore: number;
  qualityScore: number;
  resourceStabilityScore: number;
  timelineAdherenceScore: number;
  complianceScore: number;
  riskExposureScore: number;

  signals: ExecutionSupervisionSignal[];
  constraints: ExecutionSupervisionConstraint[];
  checkpoints: ExecutionSupervisionCheckpoint[];
  policies: ExecutionSupervisionPolicy[];

  autonomousInterventionEnabled: boolean;
  rollbackAvailable: boolean;
  pauseAvailable: boolean;
  executiveEscalationAvailable: boolean;

  evaluatedAt: string;
}

export interface CreateExecutionSupervisionContextInput {
  organizationId: string;
  supervisionRequestId: string;
  executionId: string;
  executionTitle: string;

  executionOwner?: string | null;
  executionStartedAt?: string;
  expectedCompletionAt?: string | null;

  currentProgress?: number;
  expectedProgress?: number;

  executionHealthScore?: number;
  performanceScore?: number;
  qualityScore?: number;
  resourceStabilityScore?: number;
  timelineAdherenceScore?: number;
  complianceScore?: number;
  riskExposureScore?: number;

  signals?: ExecutionSupervisionSignal[];
  constraints?: ExecutionSupervisionConstraint[];
  checkpoints?: ExecutionSupervisionCheckpoint[];
  policies?: ExecutionSupervisionPolicy[];

  autonomousInterventionEnabled?: boolean;
  rollbackAvailable?: boolean;
  pauseAvailable?: boolean;
  executiveEscalationAvailable?: boolean;

  evaluatedAt?: string;
}

function normalizeScore(
  value: number | undefined,
  fallback: number,
): number {
  const normalized = value ?? fallback;

  return Math.max(
    0,
    Math.min(100, Math.round(normalized)),
  );
}

export function createExecutionSupervisionContext(
  input: CreateExecutionSupervisionContextInput,
): ExecutionSupervisionContext {
  const evaluatedAt =
    input.evaluatedAt ?? new Date().toISOString();

  return {
    organizationId: input.organizationId,
    supervisionRequestId:
      input.supervisionRequestId,
    executionId: input.executionId,
    executionTitle: input.executionTitle,

    executionOwner:
      input.executionOwner ?? null,

    executionStartedAt:
      input.executionStartedAt ?? evaluatedAt,

    expectedCompletionAt:
      input.expectedCompletionAt ?? null,

    currentProgress: normalizeScore(
      input.currentProgress,
      0,
    ),

    expectedProgress: normalizeScore(
      input.expectedProgress,
      0,
    ),

    executionHealthScore: normalizeScore(
      input.executionHealthScore,
      75,
    ),

    performanceScore: normalizeScore(
      input.performanceScore,
      75,
    ),

    qualityScore: normalizeScore(
      input.qualityScore,
      75,
    ),

    resourceStabilityScore: normalizeScore(
      input.resourceStabilityScore,
      75,
    ),

    timelineAdherenceScore: normalizeScore(
      input.timelineAdherenceScore,
      75,
    ),

    complianceScore: normalizeScore(
      input.complianceScore,
      100,
    ),

    riskExposureScore: normalizeScore(
      input.riskExposureScore,
      25,
    ),

    signals: input.signals ?? [],
    constraints: input.constraints ?? [],
    checkpoints: input.checkpoints ?? [],
    policies: input.policies ?? [],

    autonomousInterventionEnabled:
      input.autonomousInterventionEnabled ?? false,

    rollbackAvailable:
      input.rollbackAvailable ?? false,

    pauseAvailable:
      input.pauseAvailable ?? true,

    executiveEscalationAvailable:
      input.executiveEscalationAvailable ?? true,

    evaluatedAt,
  };
}
