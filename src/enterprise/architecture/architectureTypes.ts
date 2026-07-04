export type ArchitectureMaturityLevel =
  | "initial"
  | "emerging"
  | "defined"
  | "managed"
  | "optimized";

export type ArchitectureLifecycleStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "retired";

export type ArchitectureCriticality =
  | "low"
  | "medium"
  | "high"
  | "mission-critical";

export type ArchitectureRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface ArchitectureMetadata {
  id: string;
  name: string;
  description: string;
  owner: string;
  version: string;
  status: ArchitectureLifecycleStatus;
  maturityLevel: ArchitectureMaturityLevel;
  criticality: ArchitectureCriticality;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ArchitectureQualityAttribute {
  name: string;
  description: string;
  target: string;
  measurement: string;
  priority: ArchitectureCriticality;
}

export interface ArchitectureConstraint {
  id: string;
  name: string;
  description: string;
  impact: ArchitectureRiskLevel;
  mitigation?: string;
}