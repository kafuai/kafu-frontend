import type { DataGovernanceAuditMetadata } from "./dataGovernanceTypes";

export interface DataStewardship extends DataGovernanceAuditMetadata {
  id: string;
  assetId: string;
  stewardId: string;
  responsibilities: string[];
}

export const createDataStewardship = (
  stewardship: DataStewardship
): DataStewardship => stewardship;

export const responsibilityCount = (
  stewardship: DataStewardship
): number => stewardship.responsibilities.length;

export const hasResponsibility = (
  stewardship: DataStewardship,
  responsibility: string
): boolean => stewardship.responsibilities.includes(responsibility);
