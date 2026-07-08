export interface LicenseRenewal {
  id: string;
  licenseId: string;
  renewalDate: string;
  renewedBy?: string;
  autoRenew: boolean;
}
