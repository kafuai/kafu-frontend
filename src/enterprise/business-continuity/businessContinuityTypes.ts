export type BusinessContinuityStatus =
  | "draft"
  | "active"
  | "under_review"
  | "tested"
  | "retired";

export type BusinessContinuityCriticality =
  | "low"
  | "medium"
  | "high"
  | "critical"
  | "mission_critical";

export type BusinessContinuityRecoveryTier =
  | "tier_0"
  | "tier_1"
  | "tier_2"
  | "tier_3"
  | "tier_4";

export type BusinessContinuityTimeUnit =
  | "minutes"
  | "hours"
  | "days";

export type BusinessContinuityOwner = {
  id: string;
  name: string;
  role: string;
  email?: string;
};

export type BusinessContinuityRecoveryObjective = {
  rto: number;
  rpo: number;
  unit: BusinessContinuityTimeUnit;
  maximumTolerableDowntime?: number;
};

export type BusinessContinuityCriticalService = {
  id: string;
  name: string;
  description: string;
  owner: BusinessContinuityOwner;
  criticality: BusinessContinuityCriticality;
  recoveryTier: BusinessContinuityRecoveryTier;
  recoveryObjective: BusinessContinuityRecoveryObjective;
  enabled: boolean;
  tags?: string[];
};

export type BusinessContinuityPlanScope = {
  organizationId: string;
  businessUnit?: string;
  regions?: string[];
  services: string[];
};

export type BusinessContinuityPlan = {
  id: string;
  name: string;
  description: string;
  status: BusinessContinuityStatus;
  scope: BusinessContinuityPlanScope;
  owner: BusinessContinuityOwner;
  criticality: BusinessContinuityCriticality;
  recoveryTier: BusinessContinuityRecoveryTier;
  recoveryObjective: BusinessContinuityRecoveryObjective;
  createdAt: string;
  updatedAt: string;
  lastReviewedAt?: string;
  tags?: string[];
};