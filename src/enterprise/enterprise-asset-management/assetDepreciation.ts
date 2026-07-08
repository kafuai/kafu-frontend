export interface AssetDepreciation {
  assetId: string;
  purchaseValue: number;
  currentValue: number;
  depreciationMethod: "straight_line" | "declining_balance" | "manual";
  calculatedAt: string;
}
