export interface AssetRisk {
  id: string;
  assetId: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  mitigation?: string;
}
