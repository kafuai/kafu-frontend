export interface LicenseCompliance {
  id: string;
  licenseId: string;
  status: "compliant" | "non_compliant" | "pending_review";
  checkedAt: string;
  notes?: string;
}
