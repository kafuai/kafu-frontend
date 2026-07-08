import type {
  MasterDataAuditMetadata,
  MasterMatchConfidence,
} from "./masterDataManagementTypes";

export interface MasterMatchingRule extends MasterDataAuditMetadata {
  id: string;
  name: string;
  confidence: MasterMatchConfidence;
  fields: string[];
  enabled: boolean;
}

export const createMasterMatchingRule = (
  rule: MasterMatchingRule
): MasterMatchingRule => rule;

export const isMatchingRuleEnabled = (
  rule: MasterMatchingRule
): boolean => rule.enabled;

export const isExactMatchRule = (
  rule: MasterMatchingRule
): boolean => rule.confidence === "exact";
