import type { AssetManagementRecord } from "./assetManagementTypes";

export interface Asset extends AssetManagementRecord {
  description?: string;
  metadata?: Record<string, unknown>;
}
