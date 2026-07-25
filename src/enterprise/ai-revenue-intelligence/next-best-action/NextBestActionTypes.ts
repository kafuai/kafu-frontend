import type {
  DealRiskAssessment,
  DealRiskCategory,
  DealRiskLevel,
  DealRiskSignalKey,
} from "../deal-risk-detection";
import type {
  OpportunityScore,
} from "../opportunity-scoring";
import type {
  RevenuePredictionForecast,
} from "../revenue-prediction";
import type {
  WinProbabilityPrediction,
} from "../win-probability";

export type NextBestActionPriority =
  | "low"
  | "medium"
  | "high"
  | "urgent";

export type NextBestActionStatus =
  | "recommended"
  | "accepted"
  | "in-progress"
  | "completed"
  | "dismissed"
  | "expired";

export type NextBestActionType =
  | "customer-outreach"
  | "schedule-meeting"
  | "engage-decision-maker"
  | "expand-stakeholders"
  | "confirm-next-step"
  | "resolve-commercial-blocker"
  | "resolve-legal-blocker"
  | "resolve-procurement-blocker"
  | "requalify-opportunity"
  | "validate-budget"
  | "validate-timeline"
  | "strengthen-champion"
  | "competitive-response"
  | "advance-stage"
  | "update-close-date"
  | "recover-engagement"
  | "reduce-delivery-risk"
  | "executive-escalation"
  | "forecast-review"
  | "close-plan-review";

export type NextBestActionChannel =
  | "internal"
  | "email"
  | "whatsapp"
  | "voice"
  | "meeting"
  | "task";

export type NextBestActionSignalKey =
  | "criticalDealRisk"
  | "staleActivity"
  | "decisionMakerGap"
  | "stakeholderGap"
  | "qualificationGap"
  | "commercialBlocker"
  | "timelineInstability"
  | "competitiveThreat"
  | "deliveryDependency"
  | "forecastDeterioration"
  | "stageStagnation"
  | "engagementDecline";

export interface NextBestActionContext {
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;
  accountId?: string;
  ownerId?: string;

  currency: string;
  dealValue: number;

  stage?: string | null;
  expectedCloseDate?: string | null;

  daysSinceLastActivity?: number | null;
  daysInCurrentStage?: number | null;
  activityCount30Days?: number | null;

  stakeholderCount?: number | null;
  engagedStakeholderCount?: number | null;

  decisionMakerIdentified?: boolean | null;
  decisionMakerEngaged?: boolean | null;
  championIdentified?: boolean | null;

  businessNeedConfirmed?: boolean | null;
  budgetConfirmed?: boolean | null;
  timelineConfirmed?: boolean | null;

  procurementBlocker?: boolean | null;
  legalBlocker?: boolean | null;
  commercialObjectionCount?: number | null;

  competitorCount?: number | null;
  primaryCompetitorIdentified?: boolean | null;

  unresolvedDependencyCount?: number | null;

  engagementScore?: number | null;

  opportunityScore: OpportunityScore;
  winProbability: WinProbabilityPrediction;
  revenuePrediction?: RevenuePredictionForecast | null;
  dealRisk: DealRiskAssessment;

  existingOpenActionTypes?:
    readonly NextBestActionType[];

  previousRecommendedActionTypes?:
    readonly NextBestActionType[];

  metadata?: Readonly<Record<string, unknown>>;
}

export interface NextBestActionCandidate {
  signalKey: NextBestActionSignalKey;
  actionType: NextBestActionType;

  title: string;
  description: string;

  priority: NextBestActionPriority;

  channel: NextBestActionChannel;

  impactScore: number;
  urgencyScore: number;
  confidence: number;

  effortScore: number;
  relevanceScore: number;
  rankScore: number;

  dueWithinHours: number;

  relatedRiskCategory?: DealRiskCategory;
  relatedRiskSignal?: DealRiskSignalKey;
  relatedRiskLevel?: DealRiskLevel;

  reason: string;
  evidence: readonly string[];

  expectedOutcome: string;

  recommendedOwnerRole?: string;
  requiresApproval?: boolean;
}

export interface NextBestActionRecommendation {
  id?: string;

  tenantId: string;
  workspaceId?: string;
  opportunityId: string;

  actionType: NextBestActionType;
  status: NextBestActionStatus;
  priority: NextBestActionPriority;

  title: string;
  description: string;

  channel: NextBestActionChannel;

  rank: number;
  rankScore: number;

  impactScore: number;
  urgencyScore: number;
  confidence: number;
  effortScore: number;

  reason: string;
  evidence: readonly string[];
  expectedOutcome: string;

  recommendedOwnerRole?: string;
  requiresApproval: boolean;

  relatedRiskCategory?: DealRiskCategory;
  relatedRiskSignal?: DealRiskSignalKey;
  relatedRiskLevel?: DealRiskLevel;

  recommendedAt: string;
  dueAt: string;
  expiresAt: string;

  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  dismissedAt?: string;

  dispositionReason?: string;

  modelVersion: string;

  metadata?: Readonly<Record<string, unknown>>;
}

export interface NextBestActionPlan {
  id?: string;

  tenantId: string;
  workspaceId?: string;
  opportunityId: string;

  recommendations:
    readonly NextBestActionRecommendation[];

  primaryRecommendation?:
    NextBestActionRecommendation;

  totalCandidates: number;
  selectedRecommendations: number;

  urgentCount: number;
  highPriorityCount: number;

  confidence: number;

  summary: string;
  expectedRevenueImpact?: number;

  modelVersion: string;
  calculatedAt: string;
  expiresAt: string;

  sourceDealRiskCalculatedAt: string;
  sourceOpportunityScoreCalculatedAt: string;
  sourceWinProbabilityCalculatedAt: string;
  sourceRevenuePredictionCalculatedAt?: string;

  metadata?: Readonly<Record<string, unknown>>;
}

export interface NextBestActionQuery {
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;
}

export interface NextBestActionHistoryQuery
  extends NextBestActionQuery {
  limit?: number;
  before?: string;
  statuses?: readonly NextBestActionStatus[];
}

export interface NextBestActionRequest {
  context: NextBestActionContext;
  maximumRecommendations?: number;
  forceRefresh?: boolean;
  requestedBy?: string;
  correlationId?: string;
  reason?: string;
}

export interface NextBestActionStatusUpdate {
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;
  recommendationId: string;

  status: Exclude<
    NextBestActionStatus,
    "recommended"
  >;

  actorId?: string;
  reason?: string;
  occurredAt?: string;
  correlationId?: string;
}

export interface NextBestActionConfiguration {
  modelVersion: string;

  cacheTtlMs: number;
  planExpiryHours: number;
  recommendationExpiryHours: number;

  maximumRecommendations: number;
  minimumRankScore: number;
  minimumConfidence: number;

  duplicateActionPenalty: number;
  previousRecommendationPenalty: number;

  signalWeights?: Partial<
    Record<NextBestActionSignalKey, number>
  >;
}

export interface NextBestActionEvent {
  eventId: string;

  eventType:
    | "next-best-action.generated"
    | "next-best-action.urgent"
    | "next-best-action.status-changed"
    | "next-best-action.failed";

  tenantId: string;
  workspaceId?: string;
  opportunityId: string;

  recommendationId?: string;

  occurredAt: string;
  correlationId?: string;

  payload: Readonly<Record<string, unknown>>;
}

export interface NextBestActionAuditRecord {
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;
  recommendationId?: string;

  action:
    | "generate"
    | "refresh"
    | "persist"
    | "cache-hit"
    | "cache-miss"
    | "status-change"
    | "urgent-recommendation"
    | "failure";

  actorId?: string;
  correlationId?: string;
  occurredAt: string;

  details: Readonly<Record<string, unknown>>;
}

export interface NextBestActionClock {
  now(): Date;
}

export interface NextBestActionIdGenerator {
  next(): string;
}

