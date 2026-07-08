export type AssetStatus =
  | "planned"
  | "available"
  | "assigned"
  | "maintenance"
  | "retired"
  | "disposed";

export type AssetType =
  | "hardware"
  | "software"
  | "cloud"
  | "facility"
  | "vehicle"
  | "other";

export interface AssetManagementRecord {
  id: string;
  assetTag: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
