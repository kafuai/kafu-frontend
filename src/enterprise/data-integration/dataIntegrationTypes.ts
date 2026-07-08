export type DataConnectorType =
  | "database"
  | "api"
  | "file"
  | "stream"
  | "warehouse";

export type DataIntegrationStatus =
  | "draft"
  | "active"
  | "paused"
  | "failed"
  | "archived";

export type DataSyncMode =
  | "manual"
  | "scheduled"
  | "realtime";

export interface DataIntegrationAuditMetadata {
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}
