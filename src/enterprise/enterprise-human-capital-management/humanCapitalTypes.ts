export type HumanCapitalStatus =
  | "planning"
  | "active"
  | "under_review"
  | "optimizing"
  | "completed";

export type WorkforceLevel =
  | "individual"
  | "team"
  | "department"
  | "enterprise";

export interface HumanCapitalProfile {
  id: string;
  organizationId: string;
  workforceLevel: WorkforceLevel;
  status: HumanCapitalStatus;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface HumanCapitalMetric {
  name: string;
  value: number;
  measuredAt: string;
}
