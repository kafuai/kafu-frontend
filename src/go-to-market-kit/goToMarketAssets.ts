import { GoToMarketAsset } from "./goToMarketKitTypes";

export const DEFAULT_GO_TO_MARKET_ASSETS: GoToMarketAsset[] = [
  {
    id: "executive-pitch",
    title: "Executive Pitch",
    category: "sales",
    owner: "Commercial",
    status: "approved",
  },
  {
    id: "pilot-proposal",
    title: "Pilot Proposal",
    category: "commercial",
    owner: "Commercial",
    status: "approved",
  },
  {
    id: "product-demo",
    title: "Executive Product Demo",
    category: "demo",
    owner: "Product",
    status: "approved",
  },
  {
    id: "commercial-packaging",
    title: "Commercial Packaging",
    category: "pricing",
    owner: "Commercial",
    status: "approved",
  },
  {
    id: "customer-onboarding",
    title: "Customer Onboarding Plan",
    category: "customer-success",
    owner: "Customer Success",
    status: "approved",
  },
];

export function getApprovedGoToMarketAssets(
  assets: GoToMarketAsset[],
): GoToMarketAsset[] {
  return assets.filter((asset) => asset.status === "approved");
}
