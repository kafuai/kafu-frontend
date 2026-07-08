import type { DataIntegrationAuditMetadata } from "./dataIntegrationTypes";

export interface DataIntegrationMonitor extends DataIntegrationAuditMetadata {
  id: string;
  pipelineId: string;
  healthScore: number;
  latencyMs: number;
  errorCount: number;
}

export const createDataIntegrationMonitor = (
  monitor: DataIntegrationMonitor
): DataIntegrationMonitor => monitor;

export const isHealthy = (
  monitor: DataIntegrationMonitor
): boolean => monitor.healthScore >= 90;

export const hasErrors = (
  monitor: DataIntegrationMonitor
): boolean => monitor.errorCount > 0;
