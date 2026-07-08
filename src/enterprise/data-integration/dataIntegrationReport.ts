import type { DataIntegrationMonitor } from "./dataIntegrationMonitor";
import type { DataPipeline } from "./dataPipeline";

export interface DataIntegrationReport {
  generatedAt: string;
  pipelines: DataPipeline[];
  monitors: DataIntegrationMonitor[];
}

export const getPipelineCount = (
  report: DataIntegrationReport
): number => report.pipelines.length;

export const getHealthyPipelines = (
  report: DataIntegrationReport
): number =>
  report.monitors.filter(monitor => monitor.healthScore >= 90).length;

export const getUnhealthyPipelines = (
  report: DataIntegrationReport
): number =>
  report.monitors.filter(monitor => monitor.healthScore < 90).length;
