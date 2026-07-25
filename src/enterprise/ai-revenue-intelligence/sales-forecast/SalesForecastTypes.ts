import type {
  DealRiskAssessment,
  DealRiskLevel,
} from "../deal-risk-detection";
import type {
  OpportunityScore,
} from "../opportunity-scoring";
import type {
  RevenuePredictionForecast,
  RevenuePredictionRiskLevel,
} from "../revenue-prediction";
import type {
  WinProbabilityPrediction,
  WinProbabilityTrend,
} from "../win-probability";

export type SalesForecastPeriod =
  | "week"
  | "month"
  | "quarter"
  | "year"
  | "custom";

export type SalesForecastCategory =
  | "pipeline"
  | "best-case"
  | "commit"
  | "closed";

export type SalesForecastConfidence =
  | "low"
  | "moderate"
  | "high"
  | "very-high";

export type SalesForecastTrend =
  | "improving"
  | "stable"
  | "declining";

export type SalesForecastHealth =
  | "healthy"
  | "watch"
  | "at-risk"
  | "critical";

export type SalesForecastSignalKey =
  | "weightedPipeline"
  | "commitCoverage"
  | "forecastRisk"
  | "pipelineConcentration"
  | "closeDateQuality"
  | "predictionConfidence"
  | "dealMomentum"
  | "historicalAttainment";

export interface SalesForecastOpportunityInput {
  tenantId: string;
  workspaceId?: string;

  opportunityId: string;
  accountId?: string;
  ownerId?: string;
  ownerName?: string;

  name?: string;

  currency: string;
  dealValue: number;

  stage?: string | null;
  forecastCategory?: SalesForecastCategory | null;

  expectedCloseDate?: string | null;
  actualCloseDate?: string | null;

  isClosed?: boolean;
  isWon?: boolean;

  opportunityScore: OpportunityScore;
  winProbability: WinProbabilityPrediction;
  revenuePrediction: RevenuePredictionForecast;
  dealRisk?: DealRiskAssessment | null;

  metadata?: Readonly<Record<string, unknown>>;
}

export interface SalesForecastHistoricalPerformance {
  periodStart: string;
  periodEnd: string;

  quota?: number;
  forecastedRevenue?: number;
  actualRevenue?: number;

  forecastAccuracy?: number;
  attainmentRate?: number;
}

export interface SalesForecastContext {
  tenantId: string;
  workspaceId?: string;

  currency: string;

  period: SalesForecastPeriod;
  periodStart: string;
  periodEnd: string;

  quota?: number;

  opportunities:
    readonly SalesForecastOpportunityInput[];

  historicalPerformance?:
    readonly SalesForecastHistoricalPerformance[];

  previousForecastRevenue?: number | null;
  previousForecastConfidence?: number | null;

  metadata?: Readonly<Record<string, unknown>>;
}

export interface SalesForecastOpportunityResult {
  opportunityId: string;
  accountId?: string;
  ownerId?: string;
  ownerName?: string;

  name?: string;

  dealValue: number;
  predictedRevenue: number;
  weightedRevenue: number;

  winProbability: number;
  confidence: number;

  forecastCategory: SalesForecastCategory;
  riskLevel: DealRiskLevel | RevenuePredictionRiskLevel;

  expectedCloseDate?: string;

  includedInPeriod: boolean;
  inclusionReason: string;

  contributionPercent: number;

  metadata?: Readonly<Record<string, unknown>>;
}

export interface SalesForecastSignalResult {
  key: SalesForecastSignalKey;
  label: string;

  score: number;
  weight: number;
  weightedScore: number;

  confidence: number;
  available: boolean;

  reason: string;
  evidence: readonly string[];
}

export interface SalesForecastCategorySummary {
  category: SalesForecastCategory;

  opportunityCount: number;

  pipelineValue: number;
  predictedRevenue: number;
  weightedRevenue: number;

  averageProbability: number;
  averageConfidence: number;

  shareOfForecast: number;
}

export interface SalesForecastOwnerSummary {
  ownerId?: string;
  ownerName?: string;

  opportunityCount: number;

  pipelineValue: number;
  predictedRevenue: number;
  weightedRevenue: number;

  quota?: number;
  attainmentRate?: number;

  riskOpportunityCount: number;
  criticalOpportunityCount: number;
}

export interface SalesForecastRiskSummary {
  lowRiskCount: number;
  moderateRiskCount: number;
  highRiskCount: number;
  criticalRiskCount: number;

  atRiskPipelineValue: number;
  atRiskPredictedRevenue: number;

  topRiskOpportunityIds: readonly string[];
}

export interface SalesForecastExplanation {
  summary: string;

  keyDrivers: readonly string[];
  risks: readonly string[];
  actions: readonly string[];
}

export interface SalesForecast {
  id?: string;

  tenantId: string;
  workspaceId?: string;

  currency: string;

  period: SalesForecastPeriod;
  periodStart: string;
  periodEnd: string;

  pipelineValue: number;
  predictedRevenue: number;
  weightedRevenue: number;

  commitRevenue: number;
  bestCaseRevenue: number;
  closedRevenue: number;

  quota?: number;
  attainmentRate?: number;
  coverageRatio?: number;

  confidence: number;
  confidenceLevel: SalesForecastConfidence;

  trend: SalesForecastTrend;
  health: SalesForecastHealth;

  opportunityCount: number;
  includedOpportunityCount: number;

  categorySummaries:
    readonly SalesForecastCategorySummary[];

  ownerSummaries:
    readonly SalesForecastOwnerSummary[];

  opportunityResults:
    readonly SalesForecastOpportunityResult[];

  riskSummary: SalesForecastRiskSummary;

  signals: readonly SalesForecastSignalResult[];
  explanation: SalesForecastExplanation;

  modelVersion: string;
  calculatedAt: string;

  metadata?: Readonly<Record<string, unknown>>;
}

export interface SalesForecastQuery {
  tenantId: string;
  workspaceId?: string;

  period: SalesForecastPeriod;
  periodStart: string;
  periodEnd: string;
}

export interface SalesForecastHistoryQuery
  extends SalesForecastQuery {
  limit?: number;
  before?: string;
}

export interface SalesForecastRequest {
  context: SalesForecastContext;

  forceRefresh?: boolean;
  requestedBy?: string;
  correlationId?: string;
  reason?: string;
}

export interface SalesForecastConfiguration {
  modelVersion: string;

  cacheTtlMs: number;
  minimumConfidence: number;
  materialChangeThreshold: number;

  healthyCoverageThreshold: number;
  watchCoverageThreshold: number;

  signalWeights?: Partial<
    Record<SalesForecastSignalKey, number>
  >;
}

export interface SalesForecastChange {
  previousForecastRevenue?: number;
  currentForecastRevenue: number;
  delta: number;
  deltaPercent?: number;
  materiallyChanged: boolean;
}

export interface SalesForecastEvent {
  eventId: string;

  eventType:
    | "sales-forecast.calculated"
    | "sales-forecast.changed"
    | "sales-forecast.at-risk"
    | "sales-forecast.failed";

  tenantId: string;
  workspaceId?: string;

  occurredAt: string;
  correlationId?: string;

  payload: Readonly<Record<string, unknown>>;
}

export interface SalesForecastAuditRecord {
  tenantId: string;
  workspaceId?: string;

  action:
    | "calculate"
    | "refresh"
    | "persist"
    | "cache-hit"
    | "cache-miss"
    | "at-risk"
    | "failure";

  actorId?: string;
  correlationId?: string;
  occurredAt: string;

  details: Readonly<Record<string, unknown>>;
}

export interface SalesForecastClock {
  now(): Date;
}

export interface SalesForecastIdGenerator {
  next(): string;
}


