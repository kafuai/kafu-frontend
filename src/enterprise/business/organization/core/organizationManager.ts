import { BusinessOrganizationProfile } from "../models/organizationModel";
import { CreateOrganizationInput } from "../types/organizationTypes";
import { OrganizationValidator } from "../utils/organizationValidator";

export class OrganizationManager {
  private readonly validator = new OrganizationValidator();
  private readonly organizations = new Map<string, BusinessOrganizationProfile>();

  create(input: CreateOrganizationInput): BusinessOrganizationProfile {
    if (!this.validator.validateCreateInput(input)) {
      throw new Error("Invalid organization input.");
    }

    const now = Date.now();

    const profile: BusinessOrganizationProfile = {
      ...input,
      status: "onboarding",
      createdAt: now,
      updatedAt: now,
    };

    this.organizations.set(profile.id, profile);

    return profile;
  }

  get(id: string): BusinessOrganizationProfile | undefined {
    return this.organizations.get(id);
  }

  list(): BusinessOrganizationProfile[] {
    return Array.from(this.organizations.values());
  }

  activate(id: string): BusinessOrganizationProfile {
    const organization = this.organizations.get(id);

    if (!organization) {
      throw new Error("Organization not found.");
    }

    const updated: BusinessOrganizationProfile = {
      ...organization,
      status: "active",
      updatedAt: Date.now(),
    };

    this.organizations.set(id, updated);

    return updated;
  }

  count(): number {
    return this.organizations.size;
  }
}