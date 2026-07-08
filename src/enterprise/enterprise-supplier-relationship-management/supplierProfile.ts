import type { SupplierTier } from "./supplierRelationshipTypes";

export interface SupplierProfile {
  supplierId: string;
  legalName: string;
  industry: string;
  country: string;
  tier: SupplierTier;
  capabilities: string[];
}

export function createSupplierProfile(
  profile: SupplierProfile
): SupplierProfile {
  return {
    ...profile,
    capabilities: [...new Set(profile.capabilities)],
  };
}

export function hasSupplierCapability(
  profile: SupplierProfile,
  capability: string
): boolean {
  return profile.capabilities.includes(capability);
}
