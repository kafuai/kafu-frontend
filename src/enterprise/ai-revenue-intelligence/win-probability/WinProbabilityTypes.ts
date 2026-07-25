import type {
  OpportunityRiskLevel,
  OpportunityScore,
} from "../opportunity-scoring";

export type WinProbabilityBand =
  | "unlikely"
  | "possible"
  | "probable"
  | "highly-probable";

export type WinProbabilityTrend =
  | "improving"
  | "stable"
  | "declining";

export type WinProbabilitySignalKey =
  | "opportunityScore"
  | "stageMaturity"
  | "engagementMomentum"
  | "stakeholderCoverage"
  | "commercialConfidence"
  | "closeDateReliability"
  | "competitivePosition"
  | "activityRecency"
  | "historicalPerformance"
  | "riskAdjustment";

export interface WinProbabilityContext {
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;
  accountId?: string;
  ownerId?: string;

  opportunityScore: OpportunityScore;

  stage?: string | null;
  stageProbability?: number | null;

  engagementScore?: number | null;
  engagementTrend?: WinProbabilityTrend | null;
  decisionMakerCoverage?: number | null;
  executiveEngagementScore?: number | null;

  forecastConfidence?: number | null;
  historicalWinRate?: number | null;

  competitorPressureScore?: number | null;
  competitorCount?: number | null;

  daysSinceLastActivity?: number | null;
  activityCount30Days?: number | null;

  expectedCloseDate?: string | null;
  closeDateChangeCount?: number | null;

  currentRiskLevel?: OpportunityRiskLevel | null;
  predictiveRiskScore?: number | null;

  previousProbability?: number | null;
  metadata?: Readonly<Record<string, unknown>>;
}

export interface WinProbabilitySignalResult {
  key: WinProbabilitySignalKey;
  label: string;
  value: number;
  normalizedValue: number;
  coefficient: number;
  contribution: number;
  confidence: number;
  available: boolean;
  reason: string;
  evidence: readonly string[];
}

export interface WinProbabilityBreakdown {
  signals: readonly WinProbabilitySignalResult[];
  availableSignals: number;
  totalSignals: number;
  rawModelScore: number;
  positiveSignals: readonly WinProbabilitySignalResult[];
  negativeSignals: readonly WinProbabilitySignalResult[];
}

export interface WinProbabilityExplanation {
  summary: string;
  primaryDrivers: readonly string[];
  primaryRisks: readonly string[];
  recommendedActions: readonly string[];
}

export interface WinProbabilityPrediction {
  id?: string;
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;

  probability: number;
  probabilityBand: WinProbabilityBand;
  confidence: number;
  trend: WinProbabilityTrend;

  breakdown: WinProbabilityBreakdown;
  explanation: WinProbabilityExplanation;

  modelVersion: string;
  calculatedAt: string;
  sourceScoreCalculatedAt: string;
  metadata?: Readonly<Record<string, unknown>>;
}

export interface WinProbabilityHistoryEntry {
  id?: string;
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;

  probability: number;
  confidence: number;
  trend: WinProbabilityTrend;
  probabilityBand: WinProbabilityBand;
  modelVersion: string;

  reason?: string;
  calculatedAt: string;
}

export interface WinProbabilityQuery {
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;
}

export interface WinProbabilityHistoryQuery
  extends WinProbabilityQuery {
  limit?: number;
  before?: string;
}

export interface WinProbabilityRequest {
  context: WinProbabilityContext;
  forceRefresh?: boolean;
  reason?: string;
  requestedBy?: string;
  correlationId?: string;
}

export interface WinProbabilityBatchRequest {
  tenantId: string;
  workspaceId?: string;
  opportunityIds: readonly string[];
  requestedBy?: string;
  correlationId?: string;
}

export interface WinProbabilityFailure {
  opportunityId: string;
  code: string;
  message: string;
}

export interface WinProbabilityBatchResult {
  requested: number;
  succeeded: number;
  failed: number;
  predictions: readonly WinProbabilityPrediction[];
  failures: readonly WinProbabilityFailure[];
}

export interface WinProbabilityChange {
  previousProbability?: number;
  currentProbability: number;
  delta: number;
  previousBand?: WinProbabilityBand;
  currentBand: WinProbabilityBand;
  materiallyChanged: boolean;
}

export interface WinProbabilityConfiguration {
  modelVersion: string;
  materialChangeThreshold: number;
  cacheTtlMs: number;
  minimumConfidence: number;
  intercept: number;
  signalCoefficients?: Partial<
    Record<WinProbabilitySignalKey, number>
  >;
}

export interface WinProbabilityEvent {
  eventId: string;
  eventType:
    | "win-probability.calculated"
    | "win-probability.changed"
    | "win-probability.failed";
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;
  occurredAt: string;
  correlationId?: string;
  payload: Readonly<Record<string, unknown>>;
}

export interface WinProbabilityAuditRecord {
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

export interface WinProbabilityClock {
  now(): Date;
}

export interface WinProbabilityIdGenerator {
  next(): string;
}
