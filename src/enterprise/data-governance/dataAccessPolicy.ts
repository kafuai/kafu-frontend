import type {
  DataClassificationLevel,
  DataGovernanceAuditMetadata,
} from "./dataGovernanceTypes";

export interface DataAccessPolicy extends DataGovernanceAuditMetadata {
  id: string;
  resource: string;
  minimumClassification: DataClassificationLevel;
  allowedRoles: string[];
}

export const createDataAccessPolicy = (
  policy: DataAccessPolicy
): DataAccessPolicy => policy;

export const allowsRole = (
  policy: DataAccessPolicy,
  role: string
): boolean => policy.allowedRoles.includes(role);

export const roleCount = (
  policy: DataAccessPolicy
): number => policy.allowedRoles.length;
