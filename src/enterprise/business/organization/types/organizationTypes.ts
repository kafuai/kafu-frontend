export type OrganizationSize = "small" | "medium" | "large" | "enterprise";

export type OrganizationStatus = "active" | "inactive" | "onboarding";

export interface OrganizationLegalProfileInput {
  readonly legalName: string;
  readonly registrationNumber?: string;
  readonly taxNumber?: string;
  readonly country: string;
  readonly city?: string;
}

export interface OrganizationContactProfileInput {
  readonly email?: string;
  readonly phone?: string;
  readonly website?: string;
  readonly address?: string;
}

export interface OrganizationBrandProfileInput {
  readonly logoUrl?: string;
  readonly primaryColor?: string;
  readonly language?: string;
  readonly timezone?: string;
  readonly currency?: string;
}

export interface CreateOrganizationInput {
  readonly id: string;
  readonly name: string;
  readonly industry: string;
  readonly size: OrganizationSize;
  readonly legal?: OrganizationLegalProfileInput;
  readonly contact?: OrganizationContactProfileInput;
  readonly brand?: OrganizationBrandProfileInput;
}