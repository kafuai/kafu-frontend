export type CompensationStatus =
  | "draft"
  | "active"
  | "review"
  | "approved"
  | "retired";

export type CompensationLevel =
  | "employee"
  | "manager"
  | "executive"
  | "enterprise";

export interface CompensationProfile {
  id: string;
  organizationId: string;
  level: CompensationLevel;
  status: CompensationStatus;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompensationMetric {
  name: string;
  value: number;
  measuredAt: string;
}
