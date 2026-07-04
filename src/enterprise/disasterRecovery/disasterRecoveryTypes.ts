export type DisasterRecoverySeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type DisasterRecoveryPlanStatus =
  | "draft"
  | "active"
  | "retired";

export type DisasterRecoveryStrategy =
  | "backup-restore"
  | "pilot-light"
  | "warm-standby"
  | "hot-standby"
  | "multi-site";

export type RecoverySiteType =
  | "primary"
  | "secondary"
  | "cloud"
  | "hybrid"
  | "third-party";

export type DisasterRecoveryPlan = {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  status: DisasterRecoveryPlanStatus;
  severity: DisasterRecoverySeverity;
  strategy: DisasterRecoveryStrategy;
  owner: string;
  businessServices: string[];
  systems: string[];
  dependencies: string[];
  recoverySiteIds: string[];
  backupStrategyIds: string[];
  rtoMinutes: number;
  rpoMinutes: number;
  lastTestedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type DisasterRecoveryPlanInput = {
  organizationId: string;
  name: string;
  description?: string;
  severity: DisasterRecoverySeverity;
  strategy: DisasterRecoveryStrategy;
  owner: string;
  businessServices?: string[];
  systems?: string[];
  dependencies?: string[];
  recoverySiteIds?: string[];
  backupStrategyIds?: string[];
  rtoMinutes: number;
  rpoMinutes: number;
};

export type DisasterRecoveryAssessment = {
  planId: string;
  isRecoverable: boolean;
  issues: string[];
  recommendations: string[];
};