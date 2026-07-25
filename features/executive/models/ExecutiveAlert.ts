export type ExecutiveAlertSeverity =
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "info";

export type ExecutiveAlertCategory =
  | "deal-risk"
  | "revenue-drop"
  | "forecast-deviation"
  | "stalled-opportunity"
  | "missing-activity"
  | "pipeline-health"
  | "executive-attention";

export interface ExecutiveAlert {
  id: string;
  workspaceId: string;
  severity: ExecutiveAlertSeverity;
  category: ExecutiveAlertCategory;
  title: string;
  description: string;
  createdAt: Date;
  opportunityId?: string;
  dismissed: boolean;
}
