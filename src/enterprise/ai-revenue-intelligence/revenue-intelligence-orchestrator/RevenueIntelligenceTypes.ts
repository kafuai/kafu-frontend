import type {
  DealRiskAssessment,
} from "../deal-risk-detection";
import type {
  NextBestActionPlan,
} from "../next-best-action";
import type {
  OpportunityScore,
} from "../opportunity-scoring";
import type {
  RevenuePrediction,
} from "../revenue-prediction";
import type {
  SalesForecast,
} from "../sales-forecast";
import type {
  WinProbabilityPrediction,
} from "../win-probability";

export type RevenueIntelligenceScope =
  | "opportunity"
  | "pipeline"
  | "forecast";

export type RevenueIntelligenceStatus =
  | "pending"
  | "running"
  | "completed"
  | "partial"
  | "failed";

export type RevenueIntelligenceComponent =
  | "opportunity-scoring"
  | "win-probability"
  | "revenue-prediction"
  | "deal-risk-detection"
  | "next-best-action"
  | "sales-forecast";

export type RevenueIntelligenceHealth =
  | "healthy"
  | "watch"
  | "at-risk"
  | "critical";

export interface RevenueIntelligenceOpportunityReference {
  tenantId: string;
  workspaceId?: string;

  opportunityId: string;
  accountId?: string;
  ownerId?: string;

  currency: string;
  dealValue: number;

  metadata?: Readonly<Record<string, unknown>>;
}

export interface RevenueIntelligenceExecutionOptions {
  forceRefresh?: boolean;

  includeNextBestAction?: boolean;
  includeSalesForecast?: boolean;

  maximumRecommendations?: number;

  requestedBy?: string;
  correlationId?: string;
  reason?: string;
}

export interface RevenueIntelligenceOpportunityRequest {
  scope: "opportunity";

  opportunity:
    RevenueIntelligenceOpportunityReference;

  options?: RevenueIntelligenceExecutionOptions;
}

export interface RevenueIntelligencePipelineRequest {
  scope: "pipeline";

  tenantId: string;
  workspaceId?: string;

  opportunityIds?: readonly string[];

  currency: string;

  options?: RevenueIntelligenceExecutionOptions;
}

export interface RevenueIntelligenceForecastRequest {
  scope: "forecast";

  tenantId: string;
  workspaceId?: string;

  currency: string;

  period:
    | "week"
    | "month"
    | "quarter"
    | "year"
    | "custom";

  periodStart: string;
  periodEnd: string;

  options?: RevenueIntelligenceExecutionOptions;
}

export type RevenueIntelligenceRequest =
  | RevenueIntelligenceOpportunityRequest
  | RevenueIntelligencePipelineRequest
  | RevenueIntelligenceForecastRequest;

export interface RevenueIntelligenceComponentExecution {
  component: RevenueIntelligenceComponent;

  status:
    | "completed"
    | "skipped"
    | "failed";

  startedAt: string;
  completedAt: string;
  durationMs: number;

  errorCode?: string;
  errorMessage?: string;

  metadata?: Readonly<Record<string, unknown>>;
}

export interface RevenueIntelligenceOpportunitySnapshot {
  tenantId: string;
  workspaceId?: string;

  opportunityId: string;
  accountId?: string;
  ownerId?: string;

  currency: string;
  dealValue: number;

  opportunityScore: OpportunityScore;
  winProbability: WinProbabilityPrediction;
  revenuePrediction: RevenuePrediction;
  dealRisk: DealRiskAssessment;

  nextBestAction?: NextBestActionPlan;

  health: RevenueIntelligenceHealth;
  confidence: number;

  expectedRevenue: number;
  revenueAtRisk: number;

  immediateAttentionRequired: boolean;

  generatedAt: string;

  metadata?: Readonly<Record<string, unknown>>;
}

export interface RevenueIntelligencePipelineSummary {
  tenantId: string;
  workspaceId?: string;

  currency: string;

  opportunityCount: number;
  processedOpportunityCount: number;
  failedOpportunityCount: number;

  pipelineValue: number;
  expectedRevenue: number;
  revenueAtRisk: number;

  averageOpportunityScore: number;
  averageWinProbability: number;
  averageConfidence: number;
  averageRiskScore: number;

  healthyCount: number;
  watchCount: number;
  atRiskCount: number;
  criticalCount: number;

  immediateAttentionCount: number;

  topOpportunityIds: readonly string[];
  topRiskOpportunityIds: readonly string[];

  generatedAt: string;

  metadata?: Readonly<Record<string, unknown>>;
}

export interface RevenueIntelligenceResult {
  id?: string;

  tenantId: string;
  workspaceId?: string;

  scope: RevenueIntelligenceScope;
  status: RevenueIntelligenceStatus;

  opportunitySnapshot?:
    RevenueIntelligenceOpportunitySnapshot;

  pipelineSummary?:
    RevenueIntelligencePipelineSummary;

  salesForecast?: SalesForecast;

  executions:
    readonly RevenueIntelligenceComponentExecution[];

  startedAt: string;
  completedAt: string;
  durationMs: number;

  modelVersion: string;

  correlationId?: string;
  requestedBy?: string;

  metadata?: Readonly<Record<string, unknown>>;
}

export interface RevenueIntelligenceQuery {
  tenantId: string;
  workspaceId?: string;

  scope: RevenueIntelligenceScope;

  opportunityId?: string;

  periodStart?: string;
  periodEnd?: string;
}

export interface RevenueIntelligenceHistoryQuery
  extends RevenueIntelligenceQuery {
  limit?: number;
  before?: string;
}

export interface RevenueIntelligenceConfiguration {
  modelVersion: string;

  cacheTtlMs: number;

  continueOnComponentFailure: boolean;
  maximumPipelineConcurrency: number;

  healthyRiskThreshold: number;
  watchRiskThreshold: number;
  atRiskRiskThreshold: number;

  minimumSnapshotConfidence: number;
}

export interface RevenueIntelligenceEvent {
  eventId: string;

  eventType:
    | "revenue-intelligence.started"
    | "revenue-intelligence.completed"
    | "revenue-intelligence.partial"
    | "revenue-intelligence.critical"
    | "revenue-intelligence.failed";

  tenantId: string;
  workspaceId?: string;

  opportunityId?: string;

  occurredAt: string;
  correlationId?: string;

  payload: Readonly<Record<string, unknown>>;
}

export interface RevenueIntelligenceAuditRecord {
  tenantId: string;
  workspaceId?: string;

  opportunityId?: string;

  action:
    | "execute"
    | "refresh"
    | "persist"
    | "cache-hit"
    | "cache-miss"
    | "partial"
    | "critical"
    | "failure";

  actorId?: string;
  correlationId?: string;
  occurredAt: string;

  details: Readonly<Record<string, unknown>>;
}

export interface RevenueIntelligenceClock {
  now(): Date;
}

export interface RevenueIntelligenceIdGenerator {
  next(): string;
}
