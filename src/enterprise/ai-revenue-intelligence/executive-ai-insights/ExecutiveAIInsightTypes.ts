export type ExecutiveAIInsightSeverity =
  | "informational"
  | "low"
  | "medium"
  | "high"
  | "critical";

export type ExecutiveAIInsightPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type ExecutiveAIInsightCategory =
  | "revenue"
  | "pipeline"
  | "forecast"
  | "opportunity"
  | "sales-performance"
  | "risk"
  | "customer"
  | "operations"
  | "strategy";

export type ExecutiveAIInsightStatus =
  | "new"
  | "acknowledged"
  | "in-progress"
  | "resolved"
  | "dismissed";

export type ExecutiveAIInsightAudience =
  | "executive"
  | "board"
  | "sales-leadership"
  | "revenue-operations"
  | "sales-manager";

export type ExecutiveAIInsightTrend =
  | "strong-decline"
  | "decline"
  | "stable"
  | "improving"
  | "strong-improvement";

export type ExecutiveAIInsightEventType =
  | "executive-ai-insights.generated"
  | "executive-ai-insights.critical"
  | "executive-ai-insights.material-change"
  | "executive-ai-insights.failed";

export interface ExecutiveAIInsightClock {
  now(): Date;
}

export interface ExecutiveAIInsightIdGenerator {
  next(): string;
}

export interface ExecutiveAIInsightConfiguration {
  modelVersion: string;
  briefingTtlHours: number;

  maximumInsights: number;
  maximumRecommendations: number;
  maximumBoardHighlights: number;

  criticalRevenueGapPercentage: number;
  highRevenueGapPercentage: number;

  criticalPipelineHealthScore: number;
  highPipelineHealthScore: number;

  materialForecastChangePercentage: number;
  materialPipelineScoreChange: number;
}

export interface ExecutiveRevenueSnapshot {
  targetRevenue?: number;
  expectedRevenue?: number;

  conservativeRevenue?: number;
  optimisticRevenue?: number;

  targetGap?: number;
  targetAttainmentPercentage?: number;

  forecastConfidenceScore?: number;

  previousExpectedRevenue?: number;
  previousActualRevenue?: number;

  committedRevenue?: number;
  weightedPipelineValue?: number;
  totalPipelineValue?: number;
}

export interface ExecutivePipelineSnapshot {
  healthScore?: number;
  healthGrade?: string;

  coverageRatio?: number;
  pipelineGap?: number;

  openPipelineValue?: number;
  weightedPipelineValue?: number;

  staleOpportunityCount?: number;
  criticalOpportunityCount?: number;
  overdueActionCount?: number;

  previousHealthScore?: number;

  managementAttentionRequired?: boolean;
}

export interface ExecutiveOpportunitySnapshot {
  opportunityId: string;

  name?: string;
  ownerId?: string;
  accountId?: string;

  amount: number;
  weightedAmount?: number;

  stage?: string;
  expectedCloseDate?: string;

  opportunityScore?: number;
  winProbability?: number;
  riskScore?: number;
  momentumScore?: number;

  daysInStage?: number;
  daysSinceLastActivity?: number;

  committed?: boolean;
  bestCase?: boolean;

  nextAction?: string;
  overdueActionCount?: number;
}

export interface ExecutiveSalesPerformanceSnapshot {
  ownerId: string;

  pipelineValue?: number;
  weightedPipelineValue?: number;
  expectedRevenue?: number;

  targetRevenue?: number;
  targetAttainmentPercentage?: number;

  opportunityCount?: number;
  wonOpportunityCount?: number;
  lostOpportunityCount?: number;

  winRate?: number;
  averageDealSize?: number;

  activityCount?: number;
  overdueActionCount?: number;

  coachingRecommendationCount?: number;
  criticalCoachingCount?: number;
}

export interface ExecutiveRiskSnapshot {
  riskId: string;

  category:
    ExecutiveAIInsightCategory;

  title: string;
  description: string;

  severity:
    ExecutiveAIInsightSeverity;

  amountAtRisk?: number;
  probability?: number;

  opportunityIds?: readonly string[];

  recommendedAction?: string;
}

export interface ExecutiveRecommendationSnapshot {
  recommendationId: string;

  title: string;
  description: string;

  priority:
    ExecutiveAIInsightPriority;

  ownerScope:
    ExecutiveAIInsightAudience;

  expectedImpact?: string;
  rationale?: string;

  opportunityIds?: readonly string[];
}

export interface ExecutiveAIInsightContext {
  tenantId: string;
  workspaceId?: string;

  periodStart: string;
  periodEnd: string;

  revenue?: ExecutiveRevenueSnapshot;
  pipeline?: ExecutivePipelineSnapshot;

  opportunities?:
    readonly ExecutiveOpportunitySnapshot[];

  salesPerformance?:
    readonly ExecutiveSalesPerformanceSnapshot[];

  risks?:
    readonly ExecutiveRiskSnapshot[];

  recommendations?:
    readonly ExecutiveRecommendationSnapshot[];

  requestedAt?: string;

  metadata?:
    Readonly<Record<string, unknown>>;
}

export interface ExecutiveAIInsight {
  id: string;

  tenantId: string;
  workspaceId?: string;

  category:
    ExecutiveAIInsightCategory;

  severity:
    ExecutiveAIInsightSeverity;

  priority:
    ExecutiveAIInsightPriority;

  status:
    ExecutiveAIInsightStatus;

  audience:
    ExecutiveAIInsightAudience;

  title: string;
  headline: string;
  narrative: string;

  businessImpact: string;
  recommendedAction?: string;

  confidenceScore: number;

  amount?: number;
  percentage?: number;

  opportunityIds?:
    readonly string[];

  evidence:
    readonly string[];

  generatedAt: string;
  expiresAt: string;

  modelVersion: string;

  correlationId?: string;

  metadata?:
    Readonly<Record<string, unknown>>;
}

export interface ExecutiveAIInsightRecommendation {
  id: string;

  priority:
    ExecutiveAIInsightPriority;

  audience:
    ExecutiveAIInsightAudience;

  title: string;
  description: string;

  rationale: string;
  expectedImpact: string;

  actionType:
    | "review"
    | "intervene"
    | "accelerate"
    | "reforecast"
    | "coach"
    | "create-pipeline"
    | "mitigate-risk";

  opportunityIds?:
    readonly string[];
}

export interface ExecutiveBoardHighlight {
  key: string;

  type:
    | "strength"
    | "risk"
    | "decision"
    | "performance"
    | "forecast";

  title: string;
  narrative: string;

  severity:
    ExecutiveAIInsightSeverity;

  metricValue?: number;
  metricLabel?: string;
}

export interface ExecutiveBriefingSummary {
  headline: string;
  narrative: string;

  executiveStatus:
    | "strong"
    | "stable"
    | "attention-required"
    | "intervention-required";

  primaryStrength?: string;
  primaryRisk?: string;
  primaryDecision?: string;
}

export interface ExecutiveAIInsightBriefing {
  id: string;

  tenantId: string;
  workspaceId?: string;

  periodStart: string;
  periodEnd: string;

  generatedAt: string;
  expiresAt: string;

  modelVersion: string;

  executiveScore: number;

  trend:
    ExecutiveAIInsightTrend;

  trendPercentage?: number;

  insights:
    readonly ExecutiveAIInsight[];

  recommendations:
    readonly ExecutiveAIInsightRecommendation[];

  boardHighlights:
    readonly ExecutiveBoardHighlight[];

  summary:
    ExecutiveBriefingSummary;

  criticalInsightCount: number;
  highInsightCount: number;

  managementAttentionRequired: boolean;

  metadata?:
    Readonly<Record<string, unknown>>;
}

export interface ExecutiveAIInsightRequest {
  context:
    ExecutiveAIInsightContext;

  requestedBy?: string;
  correlationId?: string;
  reason?: string;

  forceRefresh?: boolean;
}

export interface ExecutiveAIInsightQuery {
  tenantId: string;
  workspaceId?: string;

  periodStart: string;
  periodEnd: string;
}

export interface ExecutiveAIInsightHistoryQuery
  extends ExecutiveAIInsightQuery {
  limit?: number;
  before?: string;
}

export interface ExecutiveAIInsightHistoryEntry {
  id: string;
  briefingId: string;

  tenantId: string;
  workspaceId?: string;

  periodStart: string;
  periodEnd: string;

  executiveScore: number;
  executiveStatus:
    ExecutiveBriefingSummary["executiveStatus"];

  criticalInsightCount: number;
  highInsightCount: number;

  generatedAt: string;
  reason?: string;
}

export interface ExecutiveAIInsightEvent {
  eventId: string;
  eventType:
    ExecutiveAIInsightEventType;

  tenantId: string;
  workspaceId?: string;

  occurredAt: string;
  correlationId?: string;

  payload:
    Readonly<Record<string, unknown>>;
}

export interface ExecutiveAIInsightAuditRecord {
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
