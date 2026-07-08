import type {
  MasterDataAuditMetadata,
  MasterDataStatus,
  MasterEntityType,
} from "./masterDataManagementTypes";

export interface MasterEntity extends MasterDataAuditMetadata {
  id: string;
  name: string;
  type: MasterEntityType;
  status: MasterDataStatus;
  owner: string;
  description?: string;
}

export const createMasterEntity = (
  entity: MasterEntity
): MasterEntity => entity;

export const isMasterEntityActive = (
  entity: MasterEntity
): boolean => entity.status === "active";

export const isCustomMasterEntity = (
  entity: MasterEntity
): boolean => entity.type === "custom";
