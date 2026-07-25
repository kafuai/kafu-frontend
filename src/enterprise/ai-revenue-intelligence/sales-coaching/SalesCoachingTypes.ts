import type {
  WinProbabilityPrediction,
  WinProbabilityTrend,
} from "../win-probability";

export type SalesCoachingPriority =
  | "critical"
  | "high"
  | "medium"
  | "low";

export type SalesCoachingCategory =
  | "engagement"
  | "stakeholder"
  | "discovery"
  | "commercial"
  | "competition"
  | "pipeline"
  | "execution"
  | "risk"
  | "forecast"
  | "momentum";

export type SalesCoachingEffort =
  | "low"
  | "medium"
  | "high";

export type SalesCoachingRecommendationStatus =
  | "proposed"
  | "accepted"
  | "in-progress"
  | "completed"
  | "dismissed"
  | "expired";

export type SalesCoachingOutcome =
  | "pending"
  | "positive"
  | "neutral"
  | "negative";

export type SalesCoachingRuleKey =
  | "recover-engagement"
  | "expand-stakeholder-coverage"
  | "secure-executive-sponsor"
  | "stabilize-close-date"
  | "strengthen-commercial-case"
  | "improve-forecast-confidence"
  | "counter-competitive-pressure"
  | "accelerate-next-step"
  | "resolve-high-risk-signals"
  | "protect-winning-momentum"
  | "validate-discovery"
  | "increase-activity-cadence";

export interface SalesCoachingEvidence {
  key: string;
  label: string;
  value?: string | number | boolean | null;
  reason: string;
  source:
    | "win-probability"
    | "opportunity"
    | "activity"
    | "stakeholder"
    | "forecast"
    | "risk"
    | "commercial"
    | "system";
}

export interface SalesCoachingAction {
  id: string;
  title: string;
  description: string;
  sequence: number;
  ownerRole:
    | "opportunity-owner"
    | "sales-manager"
    | "executive-sponsor"
    | "solution-consultant"
    | "revenue-operations";
  dueInHours: number;
  completionCriteria: readonly string[];
}

export interface SalesCoachingRecommendation {
  id?: string;
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;
  accountId?: string;
  ownerId?: string;

  ruleKey: SalesCoachingRuleKey;
  category: SalesCoachingCategory;
  priority: SalesCoachingPriority;
  effort: SalesCoachingEffort;

  title: string;
  summary: string;
  rationale: string;
  expectedImpact: string;

  score: number;
  confidence: number;
  urgency: number;

  actions: readonly SalesCoachingAction[];
  evidence: readonly SalesCoachingEvidence[];

  status: SalesCoachingRecommendationStatus;
  outcome: SalesCoachingOutcome;

  modelVersion: string;
  generatedAt: string;
  expiresAt?: string;

  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  dismissedAt?: string;

  acceptedBy?: string;
  completedBy?: string;
  dismissedBy?: string;
  dismissalReason?: string;

  metadata?: Readonly<Record<string, unknown>>;
}

export interface SalesCoachingPlan {
  id?: string;
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;
  accountId?: string;
  ownerId?: string;

  recommendations: readonly SalesCoachingRecommendation[];

  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;

  totalRecommendations: number;
  planScore: number;
  confidence: number;

  executiveSummary: string;
  immediateFocus: readonly string[];
  managementAttentionRequired: boolean;

  sourceProbability: number;
  sourceProbabilityBand:
    WinProbabilityPrediction["probabilityBand"];
  sourceProbabilityTrend: WinProbabilityTrend;
  sourcePredictionCalculatedAt: string;

  modelVersion: string;
  generatedAt: string;
  expiresAt: string;

  metadata?: Readonly<Record<string, unknown>>;
}

export interface SalesCoachingContext {
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;
  accountId?: string;
  ownerId?: string;

  winProbability: WinProbabilityPrediction;

  stage?: string | null;
  expectedCloseDate?: string | null;
  nextStep?: string | null;
  nextStepDueAt?: string | null;

  daysSinceLastActivity?: number | null;
  activityCount7Days?: number | null;
  activityCount30Days?: number | null;
  unansweredMessageCount?: number | null;

  engagementScore?: number | null;
  engagementTrend?: WinProbabilityTrend | null;

  stakeholderCoverage?: number | null;
  decisionMakerCoverage?: number | null;
  executiveSponsorConfirmed?: boolean | null;
  championConfirmed?: boolean | null;

  discoveryCompleteness?: number | null;
  businessProblemConfirmed?: boolean | null;
  decisionCriteriaConfirmed?: boolean | null;
  decisionProcessConfirmed?: boolean | null;
  budgetConfirmed?: boolean | null;
  timelineConfirmed?: boolean | null;

  commercialConfidence?: number | null;
  businessCaseStrength?: number | null;
  proposalDelivered?: boolean | null;
  pricingDiscussed?: boolean | null;

  competitorPressureScore?: number | null;
  competitorCount?: number | null;
  competitiveDifferentiationConfirmed?: boolean | null;

  forecastConfidence?: number | null;
  closeDateChangeCount?: number | null;

  predictiveRiskScore?: number | null;
  openRiskCount?: number | null;
  criticalRiskCount?: number | null;

  previousRecommendationKeys?: readonly SalesCoachingRuleKey[];

  metadata?: Readonly<Record<string, unknown>>;
}

export interface SalesCoachingConfiguration {
  modelVersion: string;
  maximumRecommendations: number;
  recommendationTtlHours: number;
  minimumRecommendationScore: number;
  minimumConfidence: number;
  criticalScoreThreshold: number;
  highScoreThreshold: number;
  mediumScoreThreshold: number;
}

export interface SalesCoachingRuleResult {
  ruleKey: SalesCoachingRuleKey;
  category: SalesCoachingCategory;
  effort: SalesCoachingEffort;

  title: string;
  summary: string;
  rationale: string;
  expectedImpact: string;

  severity: number;
  opportunityImpact: number;
  evidenceConfidence: number;
  urgency: number;

  actions: readonly Omit<SalesCoachingAction, "id">[];
  evidence: readonly SalesCoachingEvidence[];

  applicable: boolean;
}

export interface SalesCoachingRequest {
  context: SalesCoachingContext;
  requestedBy?: string;
  correlationId?: string;
  reason?: string;
  forceRefresh?: boolean;
}

export interface SalesCoachingQuery {
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;
}

export interface SalesCoachingHistoryQuery
  extends SalesCoachingQuery {
  limit?: number;
  before?: string;
}

export interface SalesCoachingHistoryEntry {
  id?: string;
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;

  planId?: string;
  recommendationCount: number;
  criticalCount: number;
  highCount: number;
  planScore: number;
  confidence: number;

  sourceProbability: number;
  reason?: string;
  generatedAt: string;
}

export interface SalesCoachingBatchRequest {
  tenantId: string;
  workspaceId?: string;
  opportunityIds: readonly string[];
  requestedBy?: string;
  correlationId?: string;
}

export interface SalesCoachingFailure {
  opportunityId: string;
  code: string;
  message: string;
}

export interface SalesCoachingBatchResult {
  requested: number;
  succeeded: number;
  failed: number;
  plans: readonly SalesCoachingPlan[];
  failures: readonly SalesCoachingFailure[];
}

export interface SalesCoachingClock {
  now(): Date;
}

export interface SalesCoachingIdGenerator {
  next(): string;
}

export interface SalesCoachingEvent {
  eventId: string;
  eventType:
    | "sales-coaching.generated"
    | "sales-coaching.material-change"
    | "sales-coaching.recommendation-status-changed"
    | "sales-coaching.failed";
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;
  occurredAt: string;
  correlationId?: string;
  payload: Readonly<Record<string, unknown>>;
}

export interface SalesCoachingAuditRecord {
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;
  action:
    | "generate"
    | "refresh"
    | "persist"
    | "cache-hit"
    | "cache-miss"
    | "status-change"
    | "failure";
  actorId?: string;
  correlationId?: string;
  occurredAt: string;
  details: Readonly<Record<string, unknown>>;
}
