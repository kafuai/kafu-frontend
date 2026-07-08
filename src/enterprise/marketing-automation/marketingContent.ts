import { MarketingContentAsset } from "./marketingAutomationTypes";

export function createMarketingContentAsset(input: MarketingContentAsset): MarketingContentAsset {
  return {
    ...input,
    title: input.title.trim(),
  };
}

export function isContentReady(asset: MarketingContentAsset): boolean {
  return asset.approved && asset.title.length > 0;
}

export function filterApprovedContent(assets: MarketingContentAsset[]): MarketingContentAsset[] {
  return assets.filter(isContentReady);
}
