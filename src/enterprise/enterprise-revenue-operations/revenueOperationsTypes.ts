export type RevenueOperationStatus =
  | "draft"
  | "active"
  | "paused"
  | "blocked"
  | "completed"
  | "archived";

export type RevenuePriority = "low" | "medium" | "high" | "critical";

export type RevenueMotion =
  | "new_business"
  | "expansion"
  | "renewal"
  | "retention"
  | "partner"
  | "enterprise";

export type RevenueRiskLevel = "low" | "medium" | "high" | "critical";

export interface RevenueOwner {
  id: string;
  name: string;
  role: string;
  team?: string;
}

export interface RevenueTimeframe {
  startDate: string;
  endDate: string;
}

export interface RevenueMetric {
  key: string;
  label: string;
  value: number;
  target?: number;
  unit?: string;
}

export interface RevenueInsight {
  id: string;
  title: string;
  summary: string;
  priority: RevenuePriority;
  createdAt: string;
}
