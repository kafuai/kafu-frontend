import type { MasterDataAuditMetadata } from "./masterDataManagementTypes";

export interface MasterAudit extends MasterDataAuditMetadata {
  id: string;
  entityId: string;
  action: string;
  actor: string;
  outcome: "success" | "failure";
  occurredAt: string;
}

export const createMasterAudit = (
  audit: MasterAudit
): MasterAudit => audit;

export const isSuccessfulMasterAudit = (
  audit: MasterAudit
): boolean => audit.outcome === "success";

export const isFailedMasterAudit = (
  audit: MasterAudit
): boolean => audit.outcome === "failure";
