import type {
  NextActionPriority,
  NextActionStatus,
  NextActionType,
  SalesActivityChannel,
  SalesActivityType,
  SalesPipelineStatus,
} from "./salesIntelligenceConstants";

export type SalesPipelineActivity = {
  id: string;
  pipelineId: string;
  activityType: SalesActivityType;
  channel: SalesActivityChannel | null;
  subject: string | null;
  description: string | null;
  outcome: string | null;
  performedBy: string | null;
  performedByName: string | null;
  occurredAt: string;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type SalesPipelineNextAction = {
  id: string;
  pipelineId: string;
  actionType: NextActionType;
  title: string;
  description: string | null;
  dueAt: string;
  ownerId: string | null;
  ownerName: string | null;
  priority: NextActionPriority;
  status: NextActionStatus;
  isPrimary: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SalesPipelineStageHistory = {
  id: string;
  pipelineId: string;
  previousStatus: SalesPipelineStatus | string | null;
  newStatus: SalesPipelineStatus | string;
  changedBy: string | null;
  changedByName: string | null;
  reason: string | null;
  changedAt: string;
};

export type CreateSalesActivityInput = {
  pipelineId: string;
  activityType: SalesActivityType;
  channel?: SalesActivityChannel | null;
  subject?: string | null;
  description?: string | null;
  outcome?: string | null;
  performedBy?: string | null;
  performedByName?: string | null;
  occurredAt?: string;
  metadata?: Record<string, unknown>;
};

export type CreateNextActionInput = {
  pipelineId: string;
  actionType: NextActionType;
  title: string;
  description?: string | null;
  dueAt: string;
  ownerId?: string | null;
  ownerName?: string | null;
  priority?: NextActionPriority;
  isPrimary?: boolean;
};

export type SalesTrendDirection = "up" | "down" | "neutral";

export type SalesHealthStatus =
  | "healthy"
  | "attention"
  | "critical";

export type SalesMetric = {
  id: string;
  label: string;
  value: string;
  detail: string;
  trend: SalesTrendDirection;
  trendValue: string;
};

export type SalesPipelineStage = {
  status: SalesPipelineStatus;
  label: string;
  opportunities: number;
  value: number;
  percentage: number;
};

export type SalesOpportunity = {
  id: string;
  companyName: string;
  opportunityName: string;
  ownerName: string;
  status: SalesPipelineStatus;
  statusLabel: string;
  value: number;
  probability: number;
  health: SalesHealthStatus;
  expectedCloseDate: string;
  nextAction: string;
  nextActionDueAt: string;
  aiInsight: string;
};

export type SalesForecastPeriod = {
  id: string;
  label: string;
  committed: number;
  probable: number;
  pipeline: number;
  target: number;
};

export type SalesIntelligenceRecommendation = {
  id: string;
  title: string;
  description: string;
  priority: NextActionPriority;
  impact: string;
  opportunityId: string | null;
};

export type SalesActivityFeedItem = {
  id: string;
  type: SalesActivityType;
  channel: SalesActivityChannel | null;
  title: string;
  description: string;
  actorName: string;
  occurredAt: string;
};

export type SalesIntelligenceSnapshot = {
  generatedAt: string;
  currency: "BHD";
  metrics: SalesMetric[];
  pipelineStages: SalesPipelineStage[];
  opportunities: SalesOpportunity[];
  forecast: SalesForecastPeriod[];
  recommendations: SalesIntelligenceRecommendation[];
  activities: SalesActivityFeedItem[];
};
