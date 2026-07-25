export type RevenuePredictionCurrency =
  | "USD"
  | "BHD"
  | "SAR"
  | "AED"
  | "EUR"
  | "GBP"
  | string;

export type RevenuePredictionHorizon =
  | "current-month"
  | "current-quarter"
  | "next-quarter"
  | "current-year"
  | "custom";

export type RevenuePredictionScenario =
  | "conservative"
  | "base"
  | "optimistic";

export type RevenuePredictionConfidence =
  | "very-low"
  | "low"
  | "medium"
  | "high"
  | "very-high";

export type RevenuePredictionRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type RevenuePredictionTrend =
  | "strong-decline"
  | "decline"
  | "stable"
  | "growth"
  | "strong-growth";

export type RevenuePredictionEventType =
  | "revenue-prediction.generated"
  | "revenue-prediction.material-change"
  | "revenue-prediction.target-risk"
  | "revenue-prediction.failed";

export interface RevenuePredictionClock {
  now(): Date;
}

export interface RevenuePredictionIdGenerator {
  next(): string;
}

export interface RevenuePredictionConfiguration {
  modelVersion: string;
  defaultCurrency: RevenuePredictionCurrency;
  forecastTtlHours: number;
  materialChangePercentage: number;
  criticalTargetGapPercentage: number;
  highTargetGapPercentage: number;
  minimumConfidenceScore: number;
  maximumHistoryEntries: number;
}

export interface RevenuePredictionOpportunityInput {
  opportunityId: string;
  tenantId: string;
  workspaceId?: string;

  name?: string;
  ownerId?: string;
  accountId?: string;

  amount: number;
  currency?: RevenuePredictionCurrency;

  stage?: string;
  stageProbability?: number;
  winProbability?: number;
  opportunityScore?: number;

  expectedCloseDate?: string;
  createdAt?: string;
  updatedAt?: string;
  lastActivityAt?: string;

  isOpen: boolean;
  isWon?: boolean;
  isLost?: boolean;

  daysInStage?: number;
  daysSinceLastActivity?: number;
  historicalWinRate?: number;

  riskScore?: number;
  healthScore?: number;
  momentumScore?: number;

  committed?: boolean;
  bestCase?: boolean;
  pipelineCategory?:
    | "commit"
    | "best-case"
    | "pipeline"
    | "omitted";

  tags?: readonly string[];
}

export interface RevenuePredictionHistoricalActual {
  periodStart: string;
  periodEnd: string;
  actualRevenue: number;
  targetRevenue?: number;
  currency?: RevenuePredictionCurrency;
}

export interface RevenuePredictionContext {
  tenantId: string;
  workspaceId?: string;

  horizon: RevenuePredictionHorizon;
  periodStart: string;
  periodEnd: string;
  currency?: RevenuePredictionCurrency;

  revenueTarget?: number;
  previousForecast?: number;
  previousActual?: number;

  opportunities:
    readonly RevenuePredictionOpportunityInput[];

  historicalActuals?:
    readonly RevenuePredictionHistoricalActual[];

  requestedAt?: string;
  metadata?: Readonly<Record<string, unknown>>;
}

export interface RevenuePredictionOpportunityContribution {
  opportunityId: string;
  name?: string;
  ownerId?: string;
  accountId?: string;

  amount: number;
  normalizedProbability: number;
  weightedRevenue: number;

  conservativeRevenue: number;
  baseRevenue: number;
  optimisticRevenue: number;

  expectedCloseDate?: string;
  stage?: string;
  pipelineCategory?:
    RevenuePredictionOpportunityInput["pipelineCategory"];

  riskAdjustment: number;
  timingAdjustment: number;
  activityAdjustment: number;
  momentumAdjustment: number;

  includedInPeriod: boolean;
  exclusionReason?: string;
}

export interface RevenuePredictionScenarioResult {
  scenario: RevenuePredictionScenario;
  predictedRevenue: number;
  targetRevenue?: number;

  targetGap?: number;
  targetAttainmentPercentage?: number;

  confidenceScore: number;
  confidence:
    RevenuePredictionConfidence;

  openPipelineValue: number;
  weightedPipelineValue: number;
  committedRevenue: number;

  opportunityCount: number;
  includedOpportunityCount: number;
}

export interface RevenuePredictionDriver {
  key: string;
  label: string;
  impact:
    | "positive"
    | "negative"
    | "neutral";
  weight: number;
  description: string;
  evidence:
    readonly string[];
}

export interface RevenuePredictionRisk {
  key: string;
  level: RevenuePredictionRiskLevel;
  title: string;
  description: string;

  impactAmount?: number;
  impactPercentage?: number;

  opportunityIds?:
    readonly string[];

  recommendedAction?: string;
}

export interface RevenuePredictionSummary {
  headline: string;
  narrative: string;

  targetStatus:
    | "above-target"
    | "on-track"
    | "at-risk"
    | "critical"
    | "not-configured";

  primaryDriver?: string;
  primaryRisk?: string;
}

export interface RevenuePredictionForecast {
  id: string;

  tenantId: string;
  workspaceId?: string;

  horizon: RevenuePredictionHorizon;
  periodStart: string;
  periodEnd: string;

  currency: RevenuePredictionCurrency;
  modelVersion: string;

  generatedAt: string;

  /**
   * Compatibility timestamp used by AI consumers.
   * Equivalent to generatedAt.
   */
  calculatedAt: string;

  expiresAt: string;

  conservative:
    RevenuePredictionScenarioResult;
  base:
    RevenuePredictionScenarioResult;
  optimistic:
    RevenuePredictionScenarioResult;

  expectedRevenue: number;

  /**
   * Compatibility alias for opportunity-level consumers.
   * Equivalent to expectedRevenue.
   */
  predictedRevenue: number;

  confidenceScore: number;
  confidence:
    RevenuePredictionConfidence;

  trend: RevenuePredictionTrend;
  trendPercentage?: number;

  revenueTarget?: number;
  targetGap?: number;
  targetAttainmentPercentage?: number;

  totalPipelineValue: number;
  weightedPipelineValue: number;
  committedRevenue: number;
  bestCaseRevenue: number;

  opportunityCount: number;
  includedOpportunityCount: number;
  excludedOpportunityCount: number;

  contributions:
    readonly RevenuePredictionOpportunityContribution[];

  drivers:
    readonly RevenuePredictionDriver[];

  risks:
    readonly RevenuePredictionRisk[];

  summary: RevenuePredictionSummary;

  /**
   * Normalized compatibility explanation for executive,
   * forecasting, and recommendation consumers.
   */
  explanation: {
    headline: string;
    narrative: string;
    recommendation: string;
  };

  /**
   * Aggregate risk level derived from forecast risks.
   */
  riskLevel: RevenuePredictionRiskLevel;

  /**
   * Present only when the forecast contains one opportunity.
   */
  opportunityId?: string;

  managementAttentionRequired: boolean;

  metadata?: Readonly<Record<string, unknown>>;
}

export interface RevenuePredictionRequest {
  context: RevenuePredictionContext;

  requestedBy?: string;
  correlationId?: string;
  reason?: string;

  forceRefresh?: boolean;
}

export interface RevenuePredictionQuery {
  tenantId: string;
  workspaceId?: string;

  horizon: RevenuePredictionHorizon;
  periodStart: string;
  periodEnd: string;
}

export interface RevenuePredictionHistoryQuery
  extends RevenuePredictionQuery {
  limit?: number;
  before?: string;
}

export interface RevenuePredictionHistoryEntry {
  id: string;
  forecastId: string;

  tenantId: string;
  workspaceId?: string;

  horizon: RevenuePredictionHorizon;
  periodStart: string;
  periodEnd: string;

  expectedRevenue: number;
  conservativeRevenue: number;
  optimisticRevenue: number;

  confidenceScore: number;
  targetRevenue?: number;
  targetGap?: number;

  generatedAt: string;
  reason?: string;
}

export interface RevenuePredictionBatchRequest {
  tenantId: string;
  workspaceId?: string;

  contexts:
    readonly RevenuePredictionContext[];

  requestedBy?: string;
  correlationId?: string;
}

export interface RevenuePredictionBatchFailure {
  periodStart: string;
  periodEnd: string;
  code: string;
  message: string;
}

export interface RevenuePredictionBatchResult {
  requested: number;
  succeeded: number;
  failed: number;

  forecasts:
    readonly RevenuePredictionForecast[];

  failures:
    readonly RevenuePredictionBatchFailure[];
}

export interface RevenuePredictionEvent {
  eventId: string;
  eventType: RevenuePredictionEventType;

  tenantId: string;
  workspaceId?: string;

  occurredAt: string;
  correlationId?: string;

  payload:
    Readonly<Record<string, unknown>>;
}

export interface RevenuePredictionAuditRecord {
  tenantId: string;
  workspaceId?: string;

  action:
    | "generate"
    | "refresh"
    | "cache-hit"
    | "cache-miss"
    | "failure";

  actorId?: string;
  correlationId?: string;
  occurredAt: string;

  details:
    Readonly<Record<string, unknown>>;
}

