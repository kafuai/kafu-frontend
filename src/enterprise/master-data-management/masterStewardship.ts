import type { MasterDataAuditMetadata } from "./masterDataManagementTypes";

export interface MasterStewardship extends MasterDataAuditMetadata {
  id: string;
  entityId: string;
  stewardId: string;
  responsibilities: string[];
}

export const createMasterStewardship = (
  stewardship: MasterStewardship
): MasterStewardship => stewardship;

export const getResponsibilityCount = (
  stewardship: MasterStewardship
): number => stewardship.responsibilities.length;

export const hasResponsibility = (
  stewardship: MasterStewardship,
  responsibility: string
): boolean => stewardship.responsibilities.includes(responsibility);
