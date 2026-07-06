import {
  OrganizationBrandProfileInput,
  OrganizationContactProfileInput,
  OrganizationLegalProfileInput,
  OrganizationSize,
  OrganizationStatus,
} from "../types/organizationTypes";

export interface OrganizationLegalProfile extends OrganizationLegalProfileInput {}

export interface OrganizationContactProfile extends OrganizationContactProfileInput {}

export interface OrganizationBrandProfile extends OrganizationBrandProfileInput {}

export interface BusinessOrganizationProfile {
  readonly id: string;
  readonly name: string;
  readonly industry: string;
  readonly size: OrganizationSize;
  readonly status: OrganizationStatus;
  readonly legal?: OrganizationLegalProfile;
  readonly contact?: OrganizationContactProfile;
  readonly brand?: OrganizationBrandProfile;
  readonly createdAt: number;
  readonly updatedAt: number;
}