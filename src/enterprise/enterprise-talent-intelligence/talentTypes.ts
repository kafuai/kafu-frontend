export type TalentStatus =
  | "identified"
  | "active"
  | "review"
  | "ready"
  | "archived";

export type TalentPotentialLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface TalentProfileRecord {
  id: string;
  employeeId: string;
  organizationId: string;
  status: TalentStatus;
  potentialLevel: TalentPotentialLevel;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface TalentMetric {
  name: string;
  value: number;
  measuredAt: string;
}
