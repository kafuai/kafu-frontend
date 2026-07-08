import type {
  DataIntegrationAuditMetadata,
  DataIntegrationStatus,
  DataSyncMode,
} from "./dataIntegrationTypes";

export interface DataSyncJob extends DataIntegrationAuditMetadata {
  id: string;
  pipelineId: string;
  mode: DataSyncMode;
  status: DataIntegrationStatus;
  startedAt?: string;
  completedAt?: string;
}

export const createDataSyncJob = (
  job: DataSyncJob
): DataSyncJob => job;

export const isSyncRunning = (
  job: DataSyncJob
): boolean => job.status === "active";

export const isRealtimeSync = (
  job: DataSyncJob
): boolean => job.mode === "realtime";
