import type {
  OpportunityRiskLevel,
} from "../opportunity-scoring";
import type {
  RevenuePrediction,
} from "../revenue-prediction";
import type {
  WinProbabilityPrediction,
  WinProbabilityTrend,
} from "../win-probability";

export type PipelineHealthLevel =
  | "excellent"
  | "healthy"
  | "watch"
  | "at-risk"
  | "critical";

export type PipelineHealthTrend =
  | "improving"
  | "stable"
  | "declining";

export type PipelineHealthSignalKey =
  | "coverage"
  | "conversionQuality"
  | "revenueConfidence"
  | "stageDistribution"
  | "pipelineVelocity"
  | "activityHealth"
  | "closeDateStability"
  | "riskConcentration"
  | "dealConcentration"
  | "forecastAccuracy";

export interface PipelineOpportunitySnapshot {
  opportunityId: string;
  accountId?: string;
  ownerId?: string;

  stage?: string | null;
  currency: string;
  dealValue: number;

  expectedCloseDate?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;

  daysInCurrentStage?: number | null;
  daysSinceLastActivity?: number | null;
  activityCount30Days?: number | null;
  closeDateChangeCount?: number | null;

  riskLevel?: OpportunityRiskLevel | null;
  opportunityScore?: number | null;
  opportunityScoreConfidence?: number | null;

  winProbability?: WinProbabilityPrediction | null;
  revenuePrediction?: RevenuePrediction | null;
}

export interface PipelineHealthContext {
  tenantId: string;
  workspaceId?: string;
  pipelineId?: string;

  currency: string;
  periodStart: string;
  periodEnd: string;

  targetRevenue?: number | null;
  historicalForecastAccuracy?: number | null;
  historicalWinRate?: number | null;

  previousHealthScore?: number | null;

  opportunities:
    readonly PipelineOpportunitySnapshot[];

  metadata?: Readonly<Record<string, unknown>>;
}

export interface PipelineHealthSignalResult {
  key: PipelineHealthSignalKey;
  label: string;

  score: number;
  weight: number;
  weightedScore: number;

  confidence: number;
  available: boolean;

  reason: string;
  evidence: readonly string[];
}

export interface PipelineHealthStageDistribution {
  stage: string;
  opportunityCount: number;
  totalValue: number;
  weightedRevenue: number;
  percentageOfValue: number;
}

export interface PipelineHealthRiskDistribution {
  riskLevel: OpportunityRiskLevel;
  opportunityCount: number;
  totalValue: number;
  percentageOfValue: number;
}

export interface PipelineHealthBreakdown {
  signals: readonly PipelineHealthSignalResult[];

  availableSignals: number;
  totalSignals: number;

  totalPipelineValue: number;
  totalWeightedRevenue: number;
  totalPredictedRevenue: number;

  targetCoverageRatio?: number;
  averageWinProbability: number;
  averageOpportunityScore: number;

  stageDistribution:
    readonly PipelineHealthStageDistribution[];

  riskDistribution:
    readonly PipelineHealthRiskDistribution[];

  positiveSignals:
    readonly PipelineHealthSignalResult[];

  negativeSignals:
    readonly PipelineHealthSignalResult[];
}

export interface PipelineHealthExplanation {
  summary: string;
  strengths: readonly string[];
  risks: readonly string[];
  recommendedActions: readonly string[];
}

export interface PipelineHealthAssessment {
  id?: string;

  tenantId: string;
  workspaceId?: string;
  pipelineId?: string;

  currency: string;

  healthScore: number;
  healthLevel: PipelineHealthLevel;
  confidence: number;
  trend: PipelineHealthTrend;

  totalPipelineValue: number;
  weightedRevenue: number;
  predictedRevenue: number;

  opportunityCount: number;
  atRiskOpportunityCount: number;
  criticalOpportunityCount: number;

  periodStart: string;
  periodEnd: string;

  breakdown: PipelineHealthBreakdown;
  explanation: PipelineHealthExplanation;

  modelVersion: string;
  calculatedAt: string;

  metadata?: Readonly<Record<string, unknown>>;
}

export interface PipelineHealthHistoryEntry {
  id?: string;

  tenantId: string;
  workspaceId?: string;
  pipelineId?: string;

  healthScore: number;
  healthLevel: PipelineHealthLevel;
  confidence: number;
  trend: PipelineHealthTrend;

  totalPipelineValue: number;
  predictedRevenue: number;
  opportunityCount: number;

  modelVersion: string;
  reason?: string;
  calculatedAt: string;
}

export interface PipelineHealthQuery {
  tenantId: string;
  workspaceId?: string;
  pipelineId?: string;
}

export interface PipelineHealthHistoryQuery
  extends PipelineHealthQuery {
  limit?: number;
  before?: string;
}

export interface PipelineHealthRequest {
  context: PipelineHealthContext;
  forceRefresh?: boolean;
  reason?: string;
  requestedBy?: string;
  correlationId?: string;
}

export interface PipelineHealthChange {
  previousHealthScore?: number;
  currentHealthScore: number;
  delta: number;
  previousLevel?: PipelineHealthLevel;
  currentLevel: PipelineHealthLevel;
  materiallyChanged: boolean;
}

export interface PipelineHealthConfiguration {
  modelVersion: string;
  cacheTtlMs: number;
  minimumConfidence: number;
  materialChangeThreshold: number;

  signalWeights?: Partial<
    Record<PipelineHealthSignalKey, number>
  >;
}

export interface PipelineHealthEvent {
  eventId: string;

  eventType:
    | "pipeline-health.calculated"
    | "pipeline-health.changed"
    | "pipeline-health.failed";

  tenantId: string;
  workspaceId?: string;
  pipelineId?: string;

  occurredAt: string;
  correlationId?: string;

  payload: Readonly<Record<string, unknown>>;
}

export interface PipelineHealthAuditRecord {
  tenantId: string;
  workspaceId?: string;
  pipelineId?: string;

  action:
    | "calculate"
    | "refresh"
    | "persist"
    | "cache-hit"
    | "cache-miss"
    | "failure";

  actorId?: string;
  correlationId?: string;
  occurredAt: string;

  details: Readonly<Record<string, unknown>>;
}

export interface PipelineHealthClock {
  now(): Date;
}

export interface PipelineHealthIdGenerator {
  next(): string;
}

export type PipelineHealthWinTrend =
  WinProbabilityTrend;
