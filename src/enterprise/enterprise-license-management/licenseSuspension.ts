export interface LicenseSuspension {
  id: string;
  licenseId: string;
  reason: string;
  suspendedBy: string;
  suspendedAt: string;
  restoredAt?: string;
}
