export type PipelineHealthGrade =
  | "excellent"
  | "healthy"
  | "watch"
  | "at-risk"
  | "critical";

export type PipelineHealthRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type PipelineHealthTrend =
  | "strong-decline"
  | "decline"
  | "stable"
  | "improving"
  | "strong-improvement";

export type PipelineHealthDimension =
  | "coverage"
  | "quality"
  | "velocity"
  | "conversion"
  | "concentration"
  | "activity"
  | "stage-balance"
  | "forecast-alignment";

export type PipelineHealthEventType =
  | "pipeline-health.generated"
  | "pipeline-health.material-change"
  | "pipeline-health.critical-risk"
  | "pipeline-health.failed";

export interface PipelineHealthClock {
  now(): Date;
}

export interface PipelineHealthIdGenerator {
  next(): string;
}

export interface PipelineHealthConfiguration {
  modelVersion: string;
  assessmentTtlHours: number;

  excellentThreshold: number;
  healthyThreshold: number;
  watchThreshold: number;
  atRiskThreshold: number;

  minimumCoverageRatio: number;
  healthyCoverageRatio: number;
  excellentCoverageRatio: number;

  staleActivityDays: number;
  criticalActivityDays: number;
  slowStageDays: number;
  criticalStageDays: number;

  materialScoreChange: number;
  concentrationRiskPercentage: number;
  criticalConcentrationPercentage: number;
}

export interface PipelineHealthOpportunityInput {
  opportunityId: string;
  tenantId: string;
  workspaceId?: string;

  name?: string;
  ownerId?: string;
  accountId?: string;

  amount: number;
  weightedAmount?: number;

  stage: string;
  stageOrder?: number;
  stageProbability?: number;
  winProbability?: number;

  expectedCloseDate?: string;
  createdAt?: string;
  updatedAt?: string;
  enteredStageAt?: string;
  lastActivityAt?: string;

  daysInStage?: number;
  daysSinceLastActivity?: number;

  isOpen: boolean;
  isWon?: boolean;
  isLost?: boolean;

  committed?: boolean;
  bestCase?: boolean;

  riskScore?: number;
  healthScore?: number;
  opportunityScore?: number;
  momentumScore?: number;

  activityCount?: number;
  stakeholderCount?: number;
  nextActionCount?: number;
  overdueActionCount?: number;

  tags?: readonly string[];
}

export interface PipelineHealthStageBenchmark {
  stage: string;
  stageOrder?: number;

  expectedConversionRate?: number;
  expectedMaximumDays?: number;
  expectedMinimumCoverage?: number;
}

export interface PipelineHealthHistoricalSnapshot {
  assessedAt: string;

  healthScore: number;
  coverageRatio?: number;
  weightedPipelineValue?: number;
  openPipelineValue?: number;

  opportunityCount?: number;
  staleOpportunityCount?: number;
  criticalOpportunityCount?: number;
}

export interface PipelineHealthContext {
  tenantId: string;
  workspaceId?: string;

  periodStart: string;
  periodEnd: string;

  revenueTarget?: number;
  revenueForecast?: number;

  opportunities:
    readonly PipelineHealthOpportunityInput[];

  stageBenchmarks?:
    readonly PipelineHealthStageBenchmark[];

  historicalSnapshots?:
    readonly PipelineHealthHistoricalSnapshot[];

  metadata?: Readonly<Record<string, unknown>>;
}

export interface PipelineHealthDimensionScore {
  dimension: PipelineHealthDimension;

  score: number;
  weight: number;
  weightedScore: number;

  grade: PipelineHealthGrade;

  summary: string;
  evidence: readonly string[];
}

export interface PipelineHealthStageAnalysis {
  stage: string;
  stageOrder?: number;

  opportunityCount: number;
  openPipelineValue: number;
  weightedPipelineValue: number;

  averageDaysInStage: number;
  averageWinProbability: number;

  staleOpportunityCount: number;
  criticalOpportunityCount: number;

  conversionRate?: number;
  expectedConversionRate?: number;

  bottleneckScore: number;
  healthScore: number;
  grade: PipelineHealthGrade;
}

export interface PipelineHealthOwnerAnalysis {
  ownerId: string;

  opportunityCount: number;
  openPipelineValue: number;
  weightedPipelineValue: number;

  averageOpportunityScore: number;
  averageRiskScore: number;
  averageMomentumScore: number;

  staleOpportunityCount: number;
  overdueActionCount: number;

  healthScore: number;
  grade: PipelineHealthGrade;
}

export interface PipelineHealthBottleneck {
  key: string;

  stage?: string;
  ownerId?: string;

  level: PipelineHealthRiskLevel;

  title: string;
  description: string;

  affectedOpportunityCount: number;
  affectedPipelineValue: number;

  opportunityIds: readonly string[];

  recommendedAction: string;
}

export interface PipelineHealthRisk {
  key: string;
  dimension: PipelineHealthDimension;

  level: PipelineHealthRiskLevel;

  title: string;
  description: string;

  scoreImpact: number;
  amountAtRisk?: number;

  opportunityIds?: readonly string[];

  recommendedAction?: string;
}

export interface PipelineHealthRecommendation {
  key: string;

  priority:
    | "critical"
    | "high"
    | "medium"
    | "low";

  title: string;
  description: string;

  rationale: string;
  expectedImpact: string;

  ownerScope:
    | "executive"
    | "sales-leadership"
    | "sales-manager"
    | "opportunity-owner";

  opportunityIds?: readonly string[];
}

export interface PipelineHealthSummary {
  headline: string;
  narrative: string;

  executiveStatus:
    | "strong"
    | "stable"
    | "attention-required"
    | "intervention-required";

  primaryStrength?: string;
  primaryRisk?: string;
  primaryAction?: string;
}

export interface PipelineHealthAssessment {
  id: string;

  tenantId: string;
  workspaceId?: string;

  periodStart: string;
  periodEnd: string;

  modelVersion: string;

  generatedAt: string;
  expiresAt: string;

  healthScore: number;
  grade: PipelineHealthGrade;

  trend: PipelineHealthTrend;
  trendPercentage?: number;

  revenueTarget?: number;
  revenueForecast?: number;

  coverageRatio?: number;
  pipelineGap?: number;

  openPipelineValue: number;
  weightedPipelineValue: number;
  committedPipelineValue: number;
  bestCasePipelineValue: number;

  opportunityCount: number;
  openOpportunityCount: number;
  wonOpportunityCount: number;
  lostOpportunityCount: number;

  staleOpportunityCount: number;
  criticalOpportunityCount: number;
  overdueActionCount: number;

  dimensions:
    readonly PipelineHealthDimensionScore[];

  stages:
    readonly PipelineHealthStageAnalysis[];

  owners:
    readonly PipelineHealthOwnerAnalysis[];

  bottlenecks:
    readonly PipelineHealthBottleneck[];

  risks:
    readonly PipelineHealthRisk[];

  recommendations:
    readonly PipelineHealthRecommendation[];

  summary: PipelineHealthSummary;

  managementAttentionRequired: boolean;

  metadata?: Readonly<Record<string, unknown>>;
}

export interface PipelineHealthRequest {
  context: PipelineHealthContext;

  requestedBy?: string;
  correlationId?: string;
  reason?: string;

  forceRefresh?: boolean;
}

export interface PipelineHealthQuery {
  tenantId: string;
  workspaceId?: string;

  periodStart: string;
  periodEnd: string;
}

export interface PipelineHealthHistoryQuery
  extends PipelineHealthQuery {
  limit?: number;
  before?: string;
}

export interface PipelineHealthHistoryEntry {
  id: string;
  assessmentId: string;

  tenantId: string;
  workspaceId?: string;

  periodStart: string;
  periodEnd: string;

  healthScore: number;
  grade: PipelineHealthGrade;

  coverageRatio?: number;

  openPipelineValue: number;
  weightedPipelineValue: number;

  staleOpportunityCount: number;
  criticalOpportunityCount: number;

  generatedAt: string;
  reason?: string;
}

export interface PipelineHealthBatchRequest {
  tenantId: string;
  workspaceId?: string;

  contexts:
    readonly PipelineHealthContext[];

  requestedBy?: string;
  correlationId?: string;
}

export interface PipelineHealthBatchFailure {
  periodStart: string;
  periodEnd: string;
  code: string;
  message: string;
}

export interface PipelineHealthBatchResult {
  requested: number;
  succeeded: number;
  failed: number;

  assessments:
    readonly PipelineHealthAssessment[];

  failures:
    readonly PipelineHealthBatchFailure[];
}

export interface PipelineHealthEvent {
  eventId: string;
  eventType: PipelineHealthEventType;

  tenantId: string;
  workspaceId?: string;

  occurredAt: string;
  correlationId?: string;

  payload:
    Readonly<Record<string, unknown>>;
}

export interface PipelineHealthAuditRecord {
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
