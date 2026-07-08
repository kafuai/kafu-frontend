export type MasterEntityType =
  | "customer"
  | "company"
  | "employee"
  | "product"
  | "vendor"
  | "custom";

export type MasterDataStatus =
  | "draft"
  | "active"
  | "inactive"
  | "merged"
  | "archived";

export type MasterMatchConfidence =
  | "low"
  | "medium"
  | "high"
  | "exact";

export interface MasterDataAuditMetadata {
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}
