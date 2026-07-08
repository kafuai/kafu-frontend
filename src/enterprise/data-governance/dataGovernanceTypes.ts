export type DataClassificationLevel =
  | "public"
  | "internal"
  | "confidential"
  | "restricted";

export type DataAssetStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "archived";

export type DataQualityStatus =
  | "passed"
  | "warning"
  | "failed";

export interface DataGovernanceAuditMetadata {
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface DataTag {
  key: string;
  value: string;
}
