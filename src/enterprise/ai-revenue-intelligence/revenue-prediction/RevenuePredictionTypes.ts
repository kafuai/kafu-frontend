import type {
  OpportunityRiskLevel,
  OpportunityScore,
} from "../opportunity-scoring";
import type {
  WinProbabilityPrediction,
  WinProbabilityTrend,
} from "../win-probability";

export type RevenuePredictionHorizon =
  | "current-month"
  | "current-quarter"
  | "next-quarter"
  | "annual";

export type RevenuePredictionConfidenceBand =
  | "low"
  | "moderate"
  | "high"
  | "very-high";

export type RevenuePredictionRisk =
  | "low"
  | "moderate"
  | "high"
  | "critical";

export type RevenuePredictionSignalKey =
  | "dealValue"
  | "winProbability"
  | "opportunityQuality"
  | "stageMaturity"
  | "closeDateReliability"
  | "forecastConfidence"
  | "engagementMomentum"
  | "activityMomentum"
  | "historicalPerformance"
  | "riskAdjustment";

export interface RevenuePredictionContext {
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;
  accountId?: string;
  ownerId?: string;

  currency: string;
  dealValue: number;

  opportunityScore: OpportunityScore;
  winProbability: WinProbabilityPrediction;

  stage?: string | null;
  stageProbability?: number | null;

  expectedCloseDate?: string | null;
  closeDateChangeCount?: number | null;

  forecastConfidence?: number | null;
  historicalWinRate?: number | null;

  engagementScore?: number | null;
  engagementTrend?: WinProbabilityTrend | null;

  activityCount30Days?: number | null;
  daysSinceLastActivity?: number | null;

  currentRiskLevel?: OpportunityRiskLevel | null;
  predictiveRiskScore?: number | null;

  previousPredictedRevenue?: number | null;
  metadata?: Readonly<Record<string, unknown>>;
}

export interface RevenuePredictionSignalResult {
  key: RevenuePredictionSignalKey;
  label: string;

  normalizedValue: number;
  coefficient: number;
  contribution: number;

  confidence: number;
  available: boolean;

  reason: string;
  evidence: readonly string[];
}

export interface RevenuePredictionBreakdown {
  signals: readonly RevenuePredictionSignalResult[];
  availableSignals: number;
  totalSignals: number;

  baseWeightedRevenue: number;
  adjustmentMultiplier: number;
  adjustedRevenue: number;

  positiveSignals: readonly RevenuePredictionSignalResult[];
  negativeSignals: readonly RevenuePredictionSignalResult[];
}

export interface RevenuePredictionExplanation {
  summary: string;
  primaryDrivers: readonly string[];
  primaryRisks: readonly string[];
  recommendedActions: readonly string[];
}

export interface RevenuePrediction {
  id?: string;

  tenantId: string;
  workspaceId?: string;
  opportunityId: string;

  currency: string;
  dealValue: number;

  predictedRevenue: number;
  weightedRevenue: number;

  optimisticRevenue: number;
  expectedRevenue: number;
  conservativeRevenue: number;

  confidence: number;
  confidenceBand: RevenuePredictionConfidenceBand;
  riskLevel: RevenuePredictionRisk;

  horizon: RevenuePredictionHorizon;

  breakdown: RevenuePredictionBreakdown;
  explanation: RevenuePredictionExplanation;

  modelVersion: string;
  calculatedAt: string;

  sourceOpportunityScoreCalculatedAt: string;
  sourceWinProbabilityCalculatedAt: string;

  metadata?: Readonly<Record<string, unknown>>;
}

export interface RevenuePredictionHistoryEntry {
  id?: string;

  tenantId: string;
  workspaceId?: string;
  opportunityId: string;

  currency: string;
  dealValue: number;
  predictedRevenue: number;
  confidence: number;
  riskLevel: RevenuePredictionRisk;
  horizon: RevenuePredictionHorizon;

  modelVersion: string;
  reason?: string;
  calculatedAt: string;
}

export interface RevenuePredictionQuery {
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;
}

export interface RevenuePredictionHistoryQuery
  extends RevenuePredictionQuery {
  limit?: number;
  before?: string;
}

export interface RevenuePredictionRequest {
  context: RevenuePredictionContext;
  horizon?: RevenuePredictionHorizon;
  forceRefresh?: boolean;
  reason?: string;
  requestedBy?: string;
  correlationId?: string;
}

export interface RevenuePredictionBatchRequest {
  tenantId: string;
  workspaceId?: string;
  opportunityIds: readonly string[];
  horizon?: RevenuePredictionHorizon;
  requestedBy?: string;
  correlationId?: string;
}

export interface RevenuePredictionFailure {
  opportunityId: string;
  code: string;
  message: string;
}

export interface RevenuePredictionBatchResult {
  requested: number;
  succeeded: number;
  failed: number;

  predictions: readonly RevenuePrediction[];
  failures: readonly RevenuePredictionFailure[];

  currencyTotals: Readonly<Record<string, number>>;
}

export interface RevenuePredictionChange {
  previousPredictedRevenue?: number;
  currentPredictedRevenue: number;
  delta: number;
  deltaPercent?: number;
  materiallyChanged: boolean;
}

export interface RevenuePredictionConfiguration {
  modelVersion: string;
  materialChangeThresholdPercent: number;
  cacheTtlMs: number;
  minimumConfidence: number;
  defaultHorizon: RevenuePredictionHorizon;

  minimumAdjustmentMultiplier: number;
  maximumAdjustmentMultiplier: number;

  signalCoefficients?: Partial<
    Record<RevenuePredictionSignalKey, number>
  >;
}

export interface RevenuePredictionEvent {
  eventId: string;
  eventType:
    | "revenue-prediction.calculated"
    | "revenue-prediction.changed"
    | "revenue-prediction.failed";

  tenantId: string;
  workspaceId?: string;
  opportunityId: string;

  occurredAt: string;
  correlationId?: string;

  payload: Readonly<Record<string, unknown>>;
}

export interface RevenuePredictionAuditRecord {
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;

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

export interface RevenuePredictionClock {
  now(): Date;
}

export interface RevenuePredictionIdGenerator {
  next(): string;
}
