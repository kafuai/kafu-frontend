import { GoToMarketKitContext } from "./goToMarketKitContext";

export function validateGoToMarketKit(
  context: GoToMarketKitContext,
): string[] {
  const issues: string[] = [];

  if (!context.kit.organizationId.trim()) {
    issues.push("Organization ID is required.");
  }

  if (!context.kit.market.trim()) {
    issues.push("Target market is required.");
  }

  if (context.kit.targetSegments.length === 0) {
    issues.push("At least one target segment is required.");
  }

  if (!context.kit.valueProposition.trim()) {
    issues.push("Value proposition is required.");
  }

  if (!context.kit.launchOwner.trim()) {
    issues.push("Launch owner is required.");
  }

  if (context.kit.assets.length === 0) {
    issues.push("At least one go-to-market asset is required.");
  }

  return issues;
}
