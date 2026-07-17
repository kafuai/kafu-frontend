export type StrategicDecisionPriority =
  | "critical"
  | "high"
  | "medium"
  | "low";

export type StrategicDecisionStatus =
  | "draft"
  | "under-review"
  | "approved"
  | "rejected"
  | "scheduled"
  | "executing"
  | "completed"
  | "cancelled";

export type StrategicDecisionCategory =
  | "growth"
  | "financial"
  | "operational"
  | "customer"
  | "workforce"
  | "technology"
  | "risk"
  | "governance"
  | "transformation";

export type StrategicDecisionTimeHorizon =
  | "immediate"
  | "short-term"
  | "medium-term"
  | "long-term";

export type StrategicDecisionConfidence =
  | "very-high"
  | "high"
  | "moderate"
  | "low";

export interface StrategicDecisionOwner {
  ownerId: string;
  ownerName: string;
  ownerRole?: string | null;
}

export interface StrategicDecisionStakeholder {
  stakeholderId: string;
  stakeholderName: string;
  stakeholderRole?: string | null;
  influenceLevel: "high" | "medium" | "low";
  approvalRequired: boolean;
}

export interface StrategicDecisionTarget {
  targetId: string;
  targetName: string;
  targetValue?: number | null;
  currentValue?: number | null;
  unit?: string | null;
  targetDate?: string | null;
}

export interface StrategicDecisionRisk {
  riskId: string;
  title: string;
  description?: string | null;
  probability: number;
  impact: number;
  mitigation?: string | null;
}
