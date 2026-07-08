import type { LicenseManagementRecord } from "./licenseManagementTypes";

export interface License extends LicenseManagementRecord {
  displayName?: string;
  metadata?: Record<string, unknown>;
}
