import type {
  DataIntegrationAuditMetadata,
  DataIntegrationStatus,
} from "./dataIntegrationTypes";

export interface DataPipeline extends DataIntegrationAuditMetadata {
  id: string;
  name: string;
  status: DataIntegrationStatus;
  sourceId: string;
  sinkId: string;
  transformationIds: string[];
}

export const createDataPipeline = (
  pipeline: DataPipeline
): DataPipeline => pipeline;

export const isPipelineActive = (
  pipeline: DataPipeline
): boolean => pipeline.status === "active";

export const transformationCount = (
  pipeline: DataPipeline
): number => pipeline.transformationIds.length;
