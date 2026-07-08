import type {
  MasterDataAuditMetadata,
  MasterDataStatus,
} from "./masterDataManagementTypes";

export interface MasterRecord extends MasterDataAuditMetadata {
  id: string;
  entityId: string;
  sourceSystem: string;
  sourceRecordId: string;
  status: MasterDataStatus;
  goldenRecord: boolean;
}

export const createMasterRecord = (
  record: MasterRecord
): MasterRecord => record;

export const isGoldenRecord = (
  record: MasterRecord
): boolean => record.goldenRecord;

export const isMasterRecordActive = (
  record: MasterRecord
): boolean => record.status === "active";
