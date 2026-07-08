import type { MasterDataAuditMetadata } from "./masterDataManagementTypes";

export interface MasterRelationship extends MasterDataAuditMetadata {
  id: string;
  sourceEntityId: string;
  targetEntityId: string;
  relationshipType: string;
  required: boolean;
}

export const createMasterRelationship = (
  relationship: MasterRelationship
): MasterRelationship => relationship;

export const isRelationshipRequired = (
  relationship: MasterRelationship
): boolean => relationship.required;

export const connectsEntity = (
  relationship: MasterRelationship,
  entityId: string
): boolean =>
  relationship.sourceEntityId === entityId ||
  relationship.targetEntityId === entityId;
