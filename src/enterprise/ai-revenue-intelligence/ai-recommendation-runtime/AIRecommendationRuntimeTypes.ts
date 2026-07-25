export type AIRecommendationSource =
  | "opportunity-scoring"
  | "win-probability"
  | "revenue-prediction"
  | "pipeline-health"
  | "sales-coaching"
  | "executive-ai-insights"
  | "predictive-risk-detection"
  | "manual"
  | "external-ai";

export type AIRecommendationCategory =
  | "revenue"
  | "pipeline"
  | "forecast"
  | "opportunity"
  | "risk"
  | "sales-coaching"
  | "customer-engagement"
  | "data-quality"
  | "operations"
  | "strategy";

export type AIRecommendationPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AIRecommendationStatus =
  | "pending"
  | "assigned"
  | "accepted"
  | "in-progress"
  | "completed"
  | "dismissed"
  | "expired"
  | "failed";

export type AIRecommendationScope =
  | "workspace"
  | "revenue-period"
  | "pipeline"
  | "forecast"
  | "opportunity"
  | "owner"
  | "account";

export type AIRecommendationAudience =
  | "executive"
  | "sales-leadership"
  | "revenue-operations"
  | "sales-manager"
  | "opportunity-owner"
  | "system";

export type AIRecommendationActionType =
  | "review"
  | "intervene"
  | "accelerate"
  | "reforecast"
  | "create-pipeline"
  | "engage-customer"
  | "requalify"
  | "coach"
  | "mitigate-risk"
  | "update-data"
  | "close-action"
  | "monitor";

export type AIRecommendationEventType =
  | "ai-recommendation.generated"
  | "ai-recommendation.assigned"
  | "ai-recommendation.accepted"
  | "ai-recommendation.started"
  | "ai-recommendation.completed"
  | "ai-recommendation.dismissed"
  | "ai-recommendation.expired"
  | "ai-recommendation.critical"
  | "ai-recommendation.failed";

export interface AIRecommendationClock {
  now(): Date;
}

export interface AIRecommendationIdGenerator {
  next(): string;
}

export interface AIRecommendationConfiguration {
  modelVersion: string;

  defaultExpirationHours: number;
  criticalExpirationHours: number;
  highExpirationHours: number;

  maximumRecommendationsPerRun: number;

  duplicateWindowHours: number;
  materialConfidenceThreshold: number;

  criticalScoreThreshold: number;
  highScoreThreshold: number;
  mediumScoreThreshold: number;
}

export interface AIRecommendationCandidate {
  source: AIRecommendationSource;
  sourceId?: string;

  category: AIRecommendationCategory;
  scope: AIRecommendationScope;

  audience: AIRecommendationAudience;
  actionType: AIRecommendationActionType;

  priority?: AIRecommendationPriority;

  title: string;
  description: string;

  rationale: string;
  expectedImpact: string;

  confidenceScore?: number;
  urgencyScore?: number;
  impactScore?: number;
  riskScore?: number;

  amountAtRisk?: number;
  expectedRevenueImpact?: number;

  tenantId: string;
  workspaceId?: string;

  opportunityId?: string;
  opportunityIds?: readonly string[];

  ownerId?: string;
  ownerIds?: readonly string[];

  accountId?: string;

  periodStart?: string;
  periodEnd?: string;

  recommendedDueAt?: string;

  deduplicationKey?: string;

  evidence?: readonly string[];

  metadata?: Readonly<Record<string, unknown>>;
}

export interface AIRecommendationContext {
  tenantId: string;
  workspaceId?: string;

  periodStart?: string;
  periodEnd?: string;

  candidates:
    readonly AIRecommendationCandidate[];

  requestedBy?: string;
  correlationId?: string;
  reason?: string;

  metadata?: Readonly<Record<string, unknown>>;
}

export interface AIRecommendation {
  id: string;

  tenantId: string;
  workspaceId?: string;

  source: AIRecommendationSource;
  sourceId?: string;

  category: AIRecommendationCategory;
  scope: AIRecommendationScope;

  audience: AIRecommendationAudience;
  actionType: AIRecommendationActionType;

  priority: AIRecommendationPriority;
  status: AIRecommendationStatus;

  title: string;
  description: string;

  rationale: string;
  expectedImpact: string;

  recommendationScore: number;
  confidenceScore: number;
  urgencyScore: number;
  impactScore: number;
  riskScore: number;

  amountAtRisk?: number;
  expectedRevenueImpact?: number;

  opportunityId?: string;
  opportunityIds?: readonly string[];

  ownerId?: string;
  ownerIds?: readonly string[];

  accountId?: string;

  periodStart?: string;
  periodEnd?: string;

  assignedTo?: string;
  assignedBy?: string;
  assignedAt?: string;

  acceptedBy?: string;
  acceptedAt?: string;

  startedBy?: string;
  startedAt?: string;

  completedBy?: string;
  completedAt?: string;
  completionNote?: string;

  dismissedBy?: string;
  dismissedAt?: string;
  dismissalReason?: string;

  generatedAt: string;
  dueAt: string;
  expiresAt: string;

  deduplicationKey: string;

  evidence: readonly string[];

  modelVersion: string;
  correlationId?: string;

  metadata?: Readonly<Record<string, unknown>>;
}

export interface AIRecommendationQueueSummary {
  total: number;

  pending: number;
  assigned: number;
  accepted: number;
  inProgress: number;
  completed: number;
  dismissed: number;
  expired: number;
  failed: number;

  critical: number;
  high: number;
  medium: number;
  low: number;

  totalAmountAtRisk: number;
  expectedRevenueImpact: number;

  managementAttentionRequired: boolean;

  primaryRecommendationId?: string;
  primaryRecommendationTitle?: string;
}

export interface AIRecommendationGenerationResult {
  tenantId: string;
  workspaceId?: string;

  generatedAt: string;

  receivedCandidateCount: number;
  deduplicatedCandidateCount: number;
  rejectedCandidateCount: number;

  recommendations:
    readonly AIRecommendation[];

  summary:
    AIRecommendationQueueSummary;
}

export interface AIRecommendationQuery {
  tenantId: string;
  workspaceId?: string;

  statuses?: readonly AIRecommendationStatus[];
  priorities?: readonly AIRecommendationPriority[];
  categories?: readonly AIRecommendationCategory[];
  sources?: readonly AIRecommendationSource[];
  scopes?: readonly AIRecommendationScope[];

  opportunityId?: string;
  ownerId?: string;
  accountId?: string;
  assignedTo?: string;

  periodStart?: string;
  periodEnd?: string;

  dueBefore?: string;
  generatedAfter?: string;

  limit?: number;
  cursor?: string;
}

export interface AIRecommendationMutationContext {
  actorId: string;
  correlationId?: string;
  note?: string;
}

export interface AIRecommendationAssignmentRequest
  extends AIRecommendationMutationContext {
  recommendationId: string;
  assignedTo: string;
}

export interface AIRecommendationAcceptanceRequest
  extends AIRecommendationMutationContext {
  recommendationId: string;
}

export interface AIRecommendationStartRequest
  extends AIRecommendationMutationContext {
  recommendationId: string;
}

export interface AIRecommendationCompletionRequest
  extends AIRecommendationMutationContext {
  recommendationId: string;
  completionNote?: string;
}

export interface AIRecommendationDismissalRequest
  extends AIRecommendationMutationContext {
  recommendationId: string;
  dismissalReason: string;
}

export interface AIRecommendationHistoryEntry {
  id: string;

  recommendationId: string;

  tenantId: string;
  workspaceId?: string;

  previousStatus?: AIRecommendationStatus;
  currentStatus: AIRecommendationStatus;

  action:
    | "generated"
    | "assigned"
    | "accepted"
    | "started"
    | "completed"
    | "dismissed"
    | "expired"
    | "failed";

  actorId?: string;
  occurredAt: string;

  note?: string;
  correlationId?: string;

  metadata?: Readonly<Record<string, unknown>>;
}

export interface AIRecommendationEvent {
  eventId: string;
  eventType: AIRecommendationEventType;

  tenantId: string;
  workspaceId?: string;

  occurredAt: string;
  correlationId?: string;

  payload:
    Readonly<Record<string, unknown>>;
}

export interface AIRecommendationAuditRecord {
  tenantId: string;
  workspaceId?: string;

  recommendationId?: string;

  action:
    | "generate"
    | "query"
    | "assign"
    | "accept"
    | "start"
    | "complete"
    | "dismiss"
    | "expire"
    | "failure";

  actorId?: string;
  correlationId?: string;
  occurredAt: string;

  details:
    Readonly<Record<string, unknown>>;
}
