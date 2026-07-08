export interface LicenseActivation {
  id: string;
  licenseId: string;
  activatedAt: string;
  activatedBy: string;
  activationSource: "admin" | "self_service" | "api" | "migration";
}
