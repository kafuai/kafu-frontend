export interface AssetMaintenance {
  id: string;
  assetId: string;
  maintenanceType: "preventive" | "corrective" | "inspection";
  scheduledAt: string;
  completedAt?: string;
  performedBy?: string;
}
