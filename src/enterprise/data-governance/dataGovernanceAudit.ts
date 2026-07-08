import type { DataGovernanceAuditMetadata } from "./dataGovernanceTypes";

export interface DataGovernanceAudit extends DataGovernanceAuditMetadata {
  id: string;
  assetId: string;
  action: string;
  actor: string;
  outcome: "success" | "failure";
  occurredAt: string;
}

export const createDataGovernanceAudit = (
  audit: DataGovernanceAudit
): DataGovernanceAudit => audit;

export const isSuccessfulAudit = (
  audit: DataGovernanceAudit
): boolean => audit.outcome === "success";

export const isFailedAudit = (
  audit: DataGovernanceAudit
): boolean => audit.outcome === "failure";
