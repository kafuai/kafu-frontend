import type { PartnerTier } from "./partnerChannelTypes";

export interface PartnerTierRule {
  tier: PartnerTier;
  minimumRevenue: number;
  minimumDeals: number;
  requiredCertifications: number;
}

export function qualifiesForTier(
  rule: PartnerTierRule,
  revenue: number,
  deals: number,
  certifications: number,
): boolean {
  return (
    revenue >= rule.minimumRevenue &&
    deals >= rule.minimumDeals &&
    certifications >= rule.requiredCertifications
  );
}
