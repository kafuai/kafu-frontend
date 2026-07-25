import type {
  NextActionPriority,
  NextActionStatus,
  NextActionType,
  SalesActivityChannel,
  SalesActivityType,
} from "../salesIntelligenceConstants";

export type UnifiedActivitySource =
  | "sales_activity"
  | "next_action";

export type UnifiedActivityCategory =
  | "lifecycle"
  | "communication"
  | "meeting"
  | "task"
  | "assignment"
  | "note"
  | "system";

export type UnifiedActivityDirection =
  | "inbound"
  | "outbound"
  | "internal"
  | "system"
  | null;

export type UnifiedActivityItem = {
  id: string;
  pipelineId: string;
  source: UnifiedActivitySource;
  sourceId: string;
  category: UnifiedActivityCategory;
  activityType: SalesActivityType | NextActionType;
  channel: SalesActivityChannel | null;
  direction: UnifiedActivityDirection;
  title: string;
  description: string | null;
  status: NextActionStatus | null;
  priority: NextActionPriority | null;
  ownerId: string | null;
  ownerName: string | null;
  occurredAt: string;
  dueAt: string | null;
  completedAt: string | null;
  metadata: Record<string, unknown>;
};

export type UnifiedActivityQuery = {
  pipelineId: string;
  categories?: UnifiedActivityCategory[];
  sources?: UnifiedActivitySource[];
  channels?: SalesActivityChannel[];
  includeCompletedActions?: boolean;
  limit?: number;
};

export type UnifiedActivitySummary = {
  totalItems: number;
  communicationCount: number;
  lifecycleCount: number;
  openActionCount: number;
  overdueActionCount: number;
  completedActionCount: number;
  latestActivityAt: string | null;
  nextScheduledActionAt: string | null;
};

export type UnifiedActivitySnapshot = {
  pipelineId: string;
  companyId: string;
  generatedAt: string;
  items: UnifiedActivityItem[];
  summary: UnifiedActivitySummary;
};
