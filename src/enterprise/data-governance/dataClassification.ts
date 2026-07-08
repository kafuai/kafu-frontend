import type {
  DataClassificationLevel,
  DataGovernanceAuditMetadata,
} from "./dataGovernanceTypes";

export interface DataClassification extends DataGovernanceAuditMetadata {
  id: string;
  assetId: string;
  level: DataClassificationLevel;
  justification?: string;
}

export const createDataClassification = (
  classification: DataClassification
): DataClassification => classification;

export const isRestrictedClassification = (
  classification: DataClassification
): boolean => classification.level === "restricted";

export const isConfidentialClassification = (
  classification: DataClassification
): boolean => classification.level === "confidential";
