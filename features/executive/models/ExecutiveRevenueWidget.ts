export type ExecutiveRevenueWidgetType =
  | "revenue-forecast"
  | "pipeline-health"
  | "executive-score"
  | "risk-detection"
  | "revenue-prediction"
  | "ai-recommendation";

export type ExecutiveRevenueWidgetPriority =
  | "critical"
  | "high"
  | "medium"
  | "low";

export interface ExecutiveRevenueWidget<
  TPayload = Readonly<Record<string, unknown>>,
> {
  id: string;
  workspaceId: string;
  type: ExecutiveRevenueWidgetType;
  title: string;
  priority: ExecutiveRevenueWidgetPriority;
  order: number;
  enabled: boolean;
  payload: TPayload;
}
