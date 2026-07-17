import { GoToMarketKitContext } from "./goToMarketKitContext";

export interface GoToMarketSummary {
  organizationId: string;
  market: string;
  launchOwner: string;
  targetSegmentCount: number;
  totalAssets: number;
  approvedAssets: number;
  unresolvedRisks: number;
}

export function buildGoToMarketSummary(
  context: GoToMarketKitContext,
): GoToMarketSummary {
  return {
    organizationId: context.kit.organizationId,
    market: context.kit.market,
    launchOwner: context.kit.launchOwner,
    targetSegmentCount: context.kit.targetSegments.length,
    totalAssets: context.kit.assets.length,
    approvedAssets: context.kit.assets.filter(
      (asset) => asset.status === "approved",
    ).length,
    unresolvedRisks: context.risks.length,
  };
}
