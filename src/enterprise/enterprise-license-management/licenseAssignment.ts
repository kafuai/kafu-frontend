export interface LicenseAssignment {
  id: string;
  licenseId: string;
  userId: string;
  assignedAt: string;
  assignedBy: string;
  revokedAt?: string;
}
