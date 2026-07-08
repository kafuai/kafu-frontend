export type ContractStatus =
  | "draft"
  | "review"
  | "approval"
  | "active"
  | "suspended"
  | "expired"
  | "terminated";

export type ContractType =
  | "customer"
  | "vendor"
  | "partner"
  | "employee"
  | "nda"
  | "msa"
  | "sla"
  | "other";

export interface ContractManagementRecord {
  id: string;
  contractNumber: string;
  title: string;
  type: ContractType;
  status: ContractStatus;
  ownerId: string;
  effectiveDate: string;
  expirationDate?: string;
  createdAt: string;
  updatedAt: string;
}
