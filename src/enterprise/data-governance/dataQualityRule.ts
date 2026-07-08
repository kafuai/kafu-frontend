import type {
  DataGovernanceAuditMetadata,
  DataQualityStatus,
} from "./dataGovernanceTypes";

export interface DataQualityRule extends DataGovernanceAuditMetadata {
  id: string;
  name: string;
  assetId: string;
  rule: string;
  status: DataQualityStatus;
}

export const createDataQualityRule = (
  qualityRule: DataQualityRule
): DataQualityRule => qualityRule;

export const isQualityPassed = (
  qualityRule: DataQualityRule
): boolean => qualityRule.status === "passed";

export const isQualityFailed = (
  qualityRule: DataQualityRule
): boolean => qualityRule.status === "failed";
