import type { MasterDataAuditMetadata } from "./masterDataManagementTypes";

export interface MasterMergePolicy extends MasterDataAuditMetadata {
  id: string;
  name: string;
  prioritizeGoldenRecord: boolean;
  preserveSourceReferences: boolean;
  automaticMerge: boolean;
}

export const createMasterMergePolicy = (
  policy: MasterMergePolicy
): MasterMergePolicy => policy;

export const supportsAutomaticMerge = (
  policy: MasterMergePolicy
): boolean => policy.automaticMerge;

export const prioritizesGoldenRecord = (
  policy: MasterMergePolicy
): boolean => policy.prioritizeGoldenRecord;
