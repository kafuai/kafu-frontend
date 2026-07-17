export type GoToMarketAssetStatus =
  | "draft"
  | "review"
  | "approved"
  | "published";

export interface GoToMarketAsset {
  id: string;
  title: string;
  category: string;
  owner: string;
  status: GoToMarketAssetStatus;
  updatedAt?: string;
}

export interface GoToMarketKit {
  organizationId: string;
  market: string;
  targetSegments: string[];
  valueProposition: string;
  launchOwner: string;
  assets: GoToMarketAsset[];
}
