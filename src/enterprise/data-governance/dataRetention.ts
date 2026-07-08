import type { DataGovernanceAuditMetadata } from "./dataGovernanceTypes";

export interface DataRetention extends DataGovernanceAuditMetadata {
  id: string;
  assetId: string;
  retentionDays: number;
  archiveAfterDays?: number;
  deleteAfterDays?: number;
}

export const createDataRetention = (
  retention: DataRetention
): DataRetention => retention;

export const isRetentionExpired = (
  retention: DataRetention,
  ageInDays: number
): boolean => ageInDays >= retention.retentionDays;

export const shouldArchive = (
  retention: DataRetention,
  ageInDays: number
): boolean =>
  retention.archiveAfterDays !== undefined &&
  ageInDays >= retention.archiveAfterDays;
