import { EnterpriseAIProcess } from "./process.types";

export type EnterpriseAIProcessTelemetrySnapshot = {
  processId: string;
  status: string;
  workflowCount: number;
  dependencyCount: number;
  healthScore: number;
  failureRate: number;
  blockedCount: number;
  capturedAt: string;
};

export class EnterpriseAIProcessTelemetryCollector {
  collect(process: EnterpriseAIProcess): EnterpriseAIProcessTelemetrySnapshot {
    return {
      processId: process.id,
      status: process.status,
      workflowCount: process.workflowIds.length,
      dependencyCount: process.dependencies.length,
      healthScore: process.health.score,
      failureRate: process.metrics.failureRate,
      blockedCount: process.metrics.blockedCount,
      capturedAt: new Date().toISOString(),
    };
  }
}