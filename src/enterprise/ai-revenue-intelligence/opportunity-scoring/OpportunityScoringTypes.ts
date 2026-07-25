export type OpportunityRiskLevel =
  | "low"
  | "moderate"
  | "high"
  | "critical";

export type OpportunityScoreBand =
  | "very-low"
  | "low"
  | "medium"
  | "high"
  | "very-high";

export type OpportunityScoringFactorKey =
  | "dealSize"
  | "companyFit"
  | "engagement"
  | "decisionMakerCoverage"
  | "responseVelocity"
  | "activityFrequency"
  | "pipelineStage"
  | "forecastConfidence"
  | "historicalWinRate"
  | "competitorPressure"
  | "executiveEngagement"
  | "aiConfidence";

export interface OpportunityScoringContext {
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;
  accountId?: string;
  ownerId?: string;

  amount?: number | null;
  expectedRevenue?: number | null;
  currency?: string | null;

  stage?: string | null;
  stageProbability?: number | null;
  forecastConfidence?: number | null;
  historicalWinRate?: number | null;

  companyFitScore?: number | null;
  decisionMakerCoverage?: number | null;
  executiveEngagementScore?: number | null;

  engagementScore?: number | null;
  activityCount30Days?: number | null;
  meaningfulActivityCount30Days?: number | null;
  responseVelocityHours?: number | null;
  daysSinceLastActivity?: number | null;

  competitorCount?: number | null;
  competitorPressureScore?: number | null;

  aiConfidence?: number | null;

  createdAt?: string | null;
  expectedCloseDate?: string | null;
  lastActivityAt?: string | null;

  metadata?: Readonly<Record<string, unknown>>;
}

export interface OpportunityScoringFactorResult {
  key: OpportunityScoringFactorKey;
  label: string;
  score: number;
  normalizedScore: number;
  weight: number;
  weightedScore: number;
  confidence: number;
  reason: string;
  evidence: readonly string[];
  available: boolean;
}

export interface OpportunityScoreBreakdown {
  factors: readonly OpportunityScoringFactorResult[];
  totalWeight: number;
  availableWeight: number;
  rawWeightedScore: number;
  positiveFactors: readonly OpportunityScoringFactorResult[];
  negativeFactors: readonly OpportunityScoringFactorResult[];
}

export interface OpportunityScoringExplanation {
  summary: string;
  strengths: readonly string[];
  risks: readonly string[];
  recommendedFocus: readonly string[];
}

export interface OpportunityScore {
  id?: string;
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;

  score: number;
  scoreBand: OpportunityScoreBand;
  confidence: number;
  riskLevel: OpportunityRiskLevel;

  breakdown: OpportunityScoreBreakdown;
  explanation: OpportunityScoringExplanation;

  scoringVersion: string;
  calculatedAt: string;
  sourceUpdatedAt?: string;
  metadata?: Readonly<Record<string, unknown>>;
}

export interface OpportunityScoreHistoryEntry {
  id?: string;
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;

  score: number;
  confidence: number;
  riskLevel: OpportunityRiskLevel;
  scoringVersion: string;

  reason?: string;
  calculatedAt: string;
}

export interface OpportunityScoreQuery {
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;
}

export interface OpportunityScoreHistoryQuery
  extends OpportunityScoreQuery {
  limit?: number;
  before?: string;
}

export interface OpportunityScoringRequest {
  context: OpportunityScoringContext;
  forceRefresh?: boolean;
  reason?: string;
  requestedBy?: string;
  correlationId?: string;
}

export interface OpportunityScoringRefreshRequest {
  tenantId: string;
  workspaceId?: string;
  opportunityIds: readonly string[];
  requestedBy?: string;
  correlationId?: string;
}

export interface OpportunityScoringRefreshResult {
  requested: number;
  succeeded: number;
  failed: number;
  scores: readonly OpportunityScore[];
  failures: readonly OpportunityScoringFailure[];
}

export interface OpportunityScoringFailure {
  opportunityId: string;
  code: string;
  message: string;
}

export interface OpportunityScoreChange {
  previousScore?: number;
  currentScore: number;
  delta: number;
  previousRiskLevel?: OpportunityRiskLevel;
  currentRiskLevel: OpportunityRiskLevel;
  materiallyChanged: boolean;
}

export interface OpportunityScoringEvent {
  eventId: string;
  eventType:
    | "opportunity.scoring.calculated"
    | "opportunity.scoring.changed"
    | "opportunity.scoring.failed";
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;
  occurredAt: string;
  correlationId?: string;
  payload: Readonly<Record<string, unknown>>;
}

export interface OpportunityScoringAuditRecord {
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

export interface OpportunityScoringConfiguration {
  scoringVersion: string;
  materialChangeThreshold: number;
  cacheTtlMs: number;
  minimumConfidence: number;
  factorWeights?: Partial<
    Record<OpportunityScoringFactorKey, number>
  >;
}

export interface OpportunityScoringClock {
  now(): Date;
}

export interface OpportunityScoringIdGenerator {
  next(): string;
}
