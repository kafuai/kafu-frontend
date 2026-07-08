import type { MasterDataAuditMetadata } from "./masterDataManagementTypes";

export interface MasterAttribute extends MasterDataAuditMetadata {
  id: string;
  entityId: string;
  name: string;
  dataType: "string" | "number" | "boolean" | "date" | "object";
  required: boolean;
  unique: boolean;
}

export const createMasterAttribute = (
  attribute: MasterAttribute
): MasterAttribute => attribute;

export const isRequiredAttribute = (
  attribute: MasterAttribute
): boolean => attribute.required;

export const isUniqueAttribute = (
  attribute: MasterAttribute
): boolean => attribute.unique;
