export interface LicenseEntitlement {
  id: string;
  licenseId: string;
  entitlementKey: string;
  enabled: boolean;
  limit?: number;
}
