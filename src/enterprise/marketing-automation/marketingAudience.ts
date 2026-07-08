import { MarketingAudience } from "./marketingAutomationTypes";

export function createMarketingAudience(input: MarketingAudience): MarketingAudience {
  return {
    ...input,
    estimatedSize: Math.max(0, input.estimatedSize),
    tags: Array.from(new Set(input.tags)),
  };
}

export function isAudienceMarketable(audience: MarketingAudience): boolean {
  return audience.estimatedSize > 0 && audience.consentStatus === "opted_in";
}

export function summarizeAudience(audience: MarketingAudience): string {
  return `${audience.name} (${audience.estimatedSize} contacts)`;
}
