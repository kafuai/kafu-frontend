export type LicenseStatus =
  | "draft"
  | "active"
  | "suspended"
  | "expired"
  | "revoked";

export type LicensePlan =
  | "trial"
  | "starter"
  | "professional"
  | "enterprise"
  | "custom";

export interface LicenseManagementRecord {
  id: string;
  licenseKey: string;
  organizationId: string;
  plan: LicensePlan;
  status: LicenseStatus;
  issuedAt: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}
