export type WorkforceManagementStatus =
  | "planning"
  | "active"
  | "optimized"
  | "under_review"
  | "closed";

export type WorkforcePriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface WorkforceManagementProfile {
  id: string;
  organizationId: string;
  status: WorkforceManagementStatus;
  priority: WorkforcePriority;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkforceMetric {
  name: string;
  value: number;
  measuredAt: string;
}
