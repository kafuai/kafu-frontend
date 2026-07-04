import {
  ArchitectureLifecycleStatus,
  ArchitectureRiskLevel,
} from "./architectureTypes";

export interface ArchitectureDecision {
  id: string;
  title: string;
  description: string;
  rationale: string;
  alternatives: string[];
  consequences: string[];
  risk: ArchitectureRiskLevel;
  status: ArchitectureLifecycleStatus;
  approvedBy?: string;
}

export function createArchitectureDecision(
  decision: ArchitectureDecision,
): ArchitectureDecision {
  return {
    ...decision,
    alternatives: [...decision.alternatives],
    consequences: [...decision.consequences],
  };
}

export function isApprovedDecision(
  decision: ArchitectureDecision,
): boolean {
  return decision.status === "active";
}