import type {
  OpportunityRiskLevel,
  OpportunityScore,
} from "../opportunity-scoring";
import type {
  RevenuePrediction,
  RevenuePredictionRisk,
} from "../revenue-prediction";
import type {
  WinProbabilityPrediction,
  WinProbabilityTrend,
} from "../win-probability";

export type DealRiskLevel =
  | "low"
  | "moderate"
  | "high"
  | "critical";

export type DealRiskTrend =
  | "improving"
  | "stable"
  | "worsening";

export type DealRiskCategory =
  | "engagement"
  | "activity"
  | "stakeholder"
  | "commercial"
  | "timeline"
  | "competition"
  | "qualification"
  | "forecast"
  | "delivery"
  | "concentration";

export type DealRiskSignalKey =
  | "engagementDecline"
  | "activityInactivity"
  | "stakeholderCoverage"
  | "decisionMakerAccess"
  | "closeDateInstability"
  | "stageStagnation"
  | "commercialFriction"
  | "competitivePressure"
  | "qualificationWeakness"
  | "forecastDeterioration"
  | "revenueExposure"
  | "deliveryDependency";

export interface DealRiskContext {
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;
  accountId?: string;
  ownerId?: string;

  currency: string;
  dealValue: number;

  stage?: string | null;
  expectedCloseDate?: string | null;

  daysInCurrentStage?: number | null;
  daysSinceLastActivity?: number | null;
  activityCount30Days?: number | null;

  closeDateChangeCount?: number | null;
  expectedCloseDatePastDue?: boolean | null;

  engagementScore?: number | null;
  engagementTrend?: WinProbabilityTrend | null;

  stakeholderCount?: number | null;
  engagedStakeholderCount?: number | null;
  decisionMakerIdentified?: boolean | null;
  decisionMakerEngaged?: boolean | null;
  championIdentified?: boolean | null;

  discountPercent?: number | null;
  commercialObjectionCount?: number | null;
  procurementBlocker?: boolean | null;
  legalBlocker?: boolean | null;

  competitorCount?: number | null;
  primaryCompetitorIdentified?: boolean | null;
  competitivePositionScore?: number | null;

  qualificationScore?: number | null;
  businessNeedConfirmed?: boolean | null;
  budgetConfirmed?: boolean | null;
  timelineConfirmed?: boolean | null;

  implementationDependencyCount?: number | null;
  unresolvedDependencyCount?: number | null;
  deliveryRiskScore?: number | null;

  opportunityScore: OpportunityScore;
  winProbability: WinProbabilityPrediction;
  revenuePrediction?: RevenuePrediction | null;

  previousRiskScore?: number | null;
  previousRiskLevel?: DealRiskLevel | null;

  currentOpportunityRisk?: OpportunityRiskLevel | null;
  currentRevenueRisk?: RevenuePredictionRisk | null;

  metadata?: Readonly<Record<string, unknown>>;
}

export interface DealRiskSignalResult {
  key: DealRiskSignalKey;
  category: DealRiskCategory;
  label: string;

  riskScore: number;
  severity: DealRiskLevel;

  weight: number;
  weightedRisk: number;

  confidence: number;
  available: boolean;

  reason: string;
  evidence: readonly string[];
  recommendedAction?: string;
}

export interface DealRiskCategorySummary {
  category: DealRiskCategory;
  riskScore: number;
  severity: DealRiskLevel;
  signalCount: number;
  availableSignalCount: number;
  primaryReason?: string;
}

export interface DealRiskBreakdown {
  signals: readonly DealRiskSignalResult[];
  categories: readonly DealRiskCategorySummary[];

  availableSignals: number;
  totalSignals: number;

  activeRiskCount: number;
  highRiskCount: number;
  criticalRiskCount: number;

  topRisks: readonly DealRiskSignalResult[];
  improvingSignals: readonly DealRiskSignalResult[];
}

export interface DealRiskExplanation {
  summary: string;
  primaryRisks: readonly string[];
  supportingEvidence: readonly string[];
  recommendedActions: readonly string[];
}

export interface DealRiskAssessment {
  id?: string;

  tenantId: string;
  workspaceId?: string;
  opportunityId: string;

  currency: string;
  dealValue: number;

  riskScore: number;
  riskLevel: DealRiskLevel;
  confidence: number;
  trend: DealRiskTrend;

  activeRiskCount: number;
  highRiskCount: number;
  criticalRiskCount: number;

  immediateAttentionRequired: boolean;

  breakdown: DealRiskBreakdown;
  explanation: DealRiskExplanation;

  modelVersion: string;
  calculatedAt: string;

  sourceOpportunityScoreCalculatedAt: string;
  sourceWinProbabilityCalculatedAt: string;
  sourceRevenuePredictionCalculatedAt?: string;

  metadata?: Readonly<Record<string, unknown>>;
}

export interface DealRiskHistoryEntry {
  id?: string;

  tenantId: string;
  workspaceId?: string;
  opportunityId: string;

  riskScore: number;
  riskLevel: DealRiskLevel;
  confidence: number;
  trend: DealRiskTrend;

  activeRiskCount: number;
  criticalRiskCount: number;

  modelVersion: string;
  reason?: string;
  calculatedAt: string;
}

export interface DealRiskQuery {
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;
}

export interface DealRiskHistoryQuery
  extends DealRiskQuery {
  limit?: number;
  before?: string;
}

export interface DealRiskRequest {
  context: DealRiskContext;
  forceRefresh?: boolean;
  reason?: string;
  requestedBy?: string;
  correlationId?: string;
}

export interface DealRiskBatchRequest {
  tenantId: string;
  workspaceId?: string;
  opportunityIds: readonly string[];
  requestedBy?: string;
  correlationId?: string;
}

export interface DealRiskFailure {
  opportunityId: string;
  code: string;
  message: string;
}

export interface DealRiskBatchResult {
  requested: number;
  succeeded: number;
  failed: number;

  assessments: readonly DealRiskAssessment[];
  failures: readonly DealRiskFailure[];

  lowRiskCount: number;
  moderateRiskCount: number;
  highRiskCount: number;
  criticalRiskCount: number;
}

export interface DealRiskChange {
  previousRiskScore?: number;
  currentRiskScore: number;
  delta: number;

  previousRiskLevel?: DealRiskLevel;
  currentRiskLevel: DealRiskLevel;

  materiallyChanged: boolean;
}

export interface DealRiskConfiguration {
  modelVersion: string;
  cacheTtlMs: number;
  minimumConfidence: number;
  materialChangeThreshold: number;
  immediateAttentionThreshold: number;

  signalWeights?: Partial<
    Record<DealRiskSignalKey, number>
  >;
}

export interface DealRiskEvent {
  eventId: string;

  eventType:
    | "deal-risk.calculated"
    | "deal-risk.changed"
    | "deal-risk.critical"
    | "deal-risk.failed";

  tenantId: string;
  workspaceId?: string;
  opportunityId: string;

  occurredAt: string;
  correlationId?: string;

  payload: Readonly<Record<string, unknown>>;
}

export interface DealRiskAuditRecord {
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;

  action:
    | "calculate"
    | "refresh"
    | "persist"
    | "cache-hit"
    | "cache-miss"
    | "critical-detected"
    | "failure";

  actorId?: string;
  correlationId?: string;
  occurredAt: string;

  details: Readonly<Record<string, unknown>>;
}

export interface DealRiskClock {
  now(): Date;
}

export interface DealRiskIdGenerator {
  next(): string;
}
