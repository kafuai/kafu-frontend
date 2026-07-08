export interface AssetCompliance {
  id: string;
  assetId: string;
  framework: string;
  status: "compliant" | "non_compliant" | "pending_review";
  checkedAt: string;
}
