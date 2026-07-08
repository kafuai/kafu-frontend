export interface AssetLifecycle {
  id: string;
  assetId: string;
  stage:
    | "procurement"
    | "deployment"
    | "operation"
    | "maintenance"
    | "retirement"
    | "disposal";
  startedAt: string;
  completedAt?: string;
}
