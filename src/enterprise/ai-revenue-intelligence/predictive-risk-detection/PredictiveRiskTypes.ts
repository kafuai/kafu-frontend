export type PredictiveRiskSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type PredictiveRiskStatus =
  | "detected"
  | "acknowledged"
  | "mitigating"
  | "resolved"
  | "dismissed";

export type PredictiveRiskCategory =
  | "deal-slippage"
  | "deal-loss"
  | "revenue-shortfall"
  | "forecast-instability"
  | "pipeline-coverage"
  | "pipeline-concentration"
  | "opportunity-inactivity"
  | "stage-stagnation"
  | "stakeholder-risk"
  | "execution-risk"
  | "owner-performance"
  | "data-quality";

export type PredictiveRiskScope =
  | "opportunity"
  | "owner"
  | "pipeline"
  | "forecast"
  | "revenue"
  | "workspace";

export type PredictiveRiskTrend =
  | "decreasing"
  | "stable"
  | "increasing"
  | "rapidly-increasing";

export type PredictiveRiskEventType =
  | "predictive-risk.generated"
  | "predictive-risk.critical"
  | "predictive-risk.material-change"
  | "predictive-risk.resolved"
  | "predictive-risk.failed";

export interface PredictiveRiskClock {
  now(): Date;
}

export interface PredictiveRiskIdGenerator {
  next(): string;
}

export interface PredictiveRiskConfiguration {
  modelVersion: string;
  assessmentTtlHours: number;

  criticalRiskThreshold: number;
  highRiskThreshold: number;
  mediumRiskThreshold: number;

  staleActivityDays: number;
  criticalActivityDays: number;

  slowStageDays: number;
  criticalStageDays: number;

  criticalCoverageRatio: number;
  highCoverageRatio: number;

  concentrationRiskPercentage: number;
  criticalConcentrationPercentage: number;

  materialRiskScoreChange: number;
  maximumRisks: number;
  maximumRecommendations: number;
}

export interface PredictiveRiskOpportunityInput {
  opportunityId: string;
  tenantId: string;
  workspaceId?: string;

  name?: string;
  ownerId?: string;
  accountId?: string;

  amount: number;
  weightedAmount?: number;

  stage?: string;
  stageProbability?: number;
  winProbability?: number;

  opportunityScore?: number;
  healthScore?: number;
  riskScore?: number;
  momentumScore?: number;

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

  stakeholderCount?: number;
  decisionMakerConfirmed?: boolean;
  economicBuyerConfirmed?: boolean;
  championConfirmed?: boolean;

  activityCount?: number;
  nextActionCount?: number;
  overdueActionCount?: number;

  competitorCount?: number;
  customerSentimentScore?: number;

  closeDateChangeCount?: number;
  amountChangeCount?: number;
  stageRegressionCount?: number;

  historicalWinRate?: number;
  ownerWinRate?: number;

  metadata?: Readonly<Record<string, unknown>>;
}

export interface PredictiveRiskRevenueInput {
  revenueTarget?: number;
  expectedRevenue?: number;
  conservativeRevenue?: number;
  optimisticRevenue?: number;

  targetGap?: number;
  targetAttainmentPercentage?: number;

  forecastConfidenceScore?: number;

  previousExpectedRevenue?: number;
  previousForecastConfidenceScore?: number;
}

export interface PredictiveRiskPipelineInput {
  healthScore?: number;
  coverageRatio?: number;

  openPipelineValue?: number;
  weightedPipelineValue?: number;

  staleOpportunityCount?: number;
  criticalOpportunityCount?: number;

  previousHealthScore?: number;
  previousCoverageRatio?: number;
}

export interface PredictiveRiskContext {
  tenantId: string;
  workspaceId?: string;

  periodStart: string;
  periodEnd: string;

  opportunities:
    readonly PredictiveRiskOpportunityInput[];

  revenue?: PredictiveRiskRevenueInput;
  pipeline?: PredictiveRiskPipelineInput;

  previousAssessment?: {
    assessedAt: string;
    overallRiskScore: number;
    criticalRiskCount: number;
    highRiskCount: number;
  };

  metadata?: Readonly<Record<string, unknown>>;
}

export interface PredictiveRiskEvidence {
  key: string;
  label: string;

  value:
    | string
    | number
    | boolean;

  weight: number;

  direction:
    | "increases-risk"
    | "reduces-risk"
    | "neutral";
}

export interface PredictiveRiskDetection {
  id: string;

  tenantId: string;
  workspaceId?: string;

  scope: PredictiveRiskScope;
  category: PredictiveRiskCategory;

  severity: PredictiveRiskSeverity;
  status: PredictiveRiskStatus;

  title: string;
  description: string;

  probabilityScore: number;
  impactScore: number;
  riskScore: number;
  confidenceScore: number;

  amountAtRisk?: number;
  expectedLoss?: number;
  delayProbability?: number;
  estimatedDelayDays?: number;

  opportunityId?: string;
  ownerId?: string;
  accountId?: string;

  opportunityIds?: readonly string[];

  evidence:
    readonly PredictiveRiskEvidence[];

  recommendedAction?: string;
  mitigationDeadline?: string;

  detectedAt: string;
  expiresAt: string;

  modelVersion: string;

  metadata?: Readonly<Record<string, unknown>>;
}

export interface PredictiveRiskRecommendation {
  id: string;

  priority:
    PredictiveRiskSeverity;

  scope:
    PredictiveRiskScope;

  title: string;
  description: string;

  rationale: string;
  expectedImpact: string;

  actionType:
    | "engage-customer"
    | "review-opportunity"
    | "requalify"
    | "reforecast"
    | "create-pipeline"
    | "executive-intervention"
    | "manager-coaching"
    | "data-remediation";

  opportunityIds?: readonly string[];
  ownerIds?: readonly string[];
}

export interface PredictiveRiskSummary {
  headline: string;
  narrative: string;

  riskPosture:
    | "controlled"
    | "elevated"
    | "high"
    | "critical";

  primaryRisk?: string;
  primaryExposure?: number;
  priorityAction?: string;
}

export interface PredictiveRiskAssessment {
  id: string;

  tenantId: string;
  workspaceId?: string;

  periodStart: string;
  periodEnd: string;

  generatedAt: string;
  expiresAt: string;

  modelVersion: string;

  overallRiskScore: number;
  overallSeverity: PredictiveRiskSeverity;

  trend: PredictiveRiskTrend;
  trendPercentage?: number;

  totalAmountAtRisk: number;
  expectedRevenueLoss: number;

  riskCount: number;
  criticalRiskCount: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;

  opportunityRiskCount: number;
  pipelineRiskCount: number;
  forecastRiskCount: number;
  revenueRiskCount: number;

  risks:
    readonly PredictiveRiskDetection[];

  recommendations:
    readonly PredictiveRiskRecommendation[];

  summary: PredictiveRiskSummary;

  managementAttentionRequired: boolean;

  metadata?: Readonly<Record<string, unknown>>;
}

export interface PredictiveRiskRequest {
  context: PredictiveRiskContext;

  requestedBy?: string;
  correlationId?: string;
  reason?: string;

  forceRefresh?: boolean;
}

export interface PredictiveRiskQuery {
  tenantId: string;
  workspaceId?: string;

  periodStart: string;
  periodEnd: string;
}

export interface PredictiveRiskHistoryQuery
  extends PredictiveRiskQuery {
  limit?: number;
  before?: string;
}

export interface PredictiveRiskHistoryEntry {
  id: string;
  assessmentId: string;

  tenantId: string;
  workspaceId?: string;

  periodStart: string;
  periodEnd: string;

  overallRiskScore: number;
  overallSeverity: PredictiveRiskSeverity;

  totalAmountAtRisk: number;
  expectedRevenueLoss: number;

  criticalRiskCount: number;
  highRiskCount: number;

  generatedAt: string;
  reason?: string;
}

export interface PredictiveRiskEvent {
  eventId: string;
  eventType: PredictiveRiskEventType;

  tenantId: string;
  workspaceId?: string;

  occurredAt: string;
  correlationId?: string;

  payload:
    Readonly<Record<string, unknown>>;
}

export interface PredictiveRiskAuditRecord {
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
