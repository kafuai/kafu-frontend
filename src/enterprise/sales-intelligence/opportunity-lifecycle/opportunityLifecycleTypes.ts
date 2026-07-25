import type {
  SalesActivityChannel,
  SalesActivityType,
  SalesPipelineStatus,
} from "../salesIntelligenceConstants";

export type OpportunityLifecycleEventKind =
  | "stage_change"
  | "activity";

export type OpportunityLifecycleStageEvent = {
  id: string;
  kind: "stage_change";
  pipelineId: string;
  previousStatus: SalesPipelineStatus | string | null;
  newStatus: SalesPipelineStatus | string;
  reason: string | null;
  actorId: string | null;
  occurredAt: string;
};

export type OpportunityLifecycleActivityEvent = {
  id: string;
  kind: "activity";
  pipelineId: string;
  activityType: SalesActivityType;
  channel: SalesActivityChannel | null;
  title: string;
  description: string | null;
  actorId: string | null;
  occurredAt: string;
};

export type OpportunityLifecycleEvent =
  | OpportunityLifecycleStageEvent
  | OpportunityLifecycleActivityEvent;

export type OpportunityLifecycleSnapshot = {
  pipelineId: string;
  companyId: string;
  generatedAt: string;
  events: OpportunityLifecycleEvent[];
};
