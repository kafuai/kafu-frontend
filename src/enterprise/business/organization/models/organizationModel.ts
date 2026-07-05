export type OrganizationSize = "small" | "medium" | "large" | "enterprise";
export type OrganizationStatus = "active" | "inactive" | "onboarding";

export interface BusinessOrganizationProfile {
  id: string;
  name: string;
  industry: string;
  size: OrganizationSize;
  status: OrganizationStatus;
  createdAt: number;
}