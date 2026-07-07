import { GoToMarketSegment } from "./goToMarketTypes";

export interface GoToMarketPricingTier {
  id: string;
  name: string;
  segment: GoToMarketSegment;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
}

export function createPricingTier(
  tier: GoToMarketPricingTier,
): GoToMarketPricingTier {
  return tier;
}