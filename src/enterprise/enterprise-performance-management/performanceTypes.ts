export type PerformanceStatus =
  | "draft"
  | "active"
  | "completed"
  | "archived";

export type PerformanceLevel =
  | "low"
  | "average"
  | "high"
  | "exceptional";

export interface PerformanceProfile {
  id: string;
  organizationId: string;
  status: PerformanceStatus;
  level: PerformanceLevel;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  measuredAt: string;
}
