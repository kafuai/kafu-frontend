import { EnterpriseAIProcess } from "./process.types";
import { EnterpriseAIProcessTelemetrySnapshot } from "./processTelemetryCollector";

export type EnterpriseAIProcessOperationalReport = {
  processId: string;
  name: string;
  status: string;
  priority: string;
  ownerName: string;
  healthState: string;
  healthScore: number;
  telemetry: EnterpriseAIProcessTelemetrySnapshot;
  recommendations: string[];
};

export class EnterpriseAIProcessOperationalReporter {
  createReport(
    process: EnterpriseAIProcess,
    telemetry: EnterpriseAIProcessTelemetrySnapshot,
  ): EnterpriseAIProcessOperationalReport {
    const recommendations: string[] = [];

    if (telemetry.failureRate > 0.15) {
      recommendations.push("Prioritize reliability improvements for this process.");
    }

    if (telemetry.blockedCount > 0) {
      recommendations.push("Resolve blockers before increasing execution throughput.");
    }

    if (telemetry.healthScore < 70) {
      recommendations.push("Escalate process health review to the owning team.");
    }

    return {
      processId: process.id,
      name: process.name,
      status: process.status,
      priority: process.priority,
      ownerName: process.owner.ownerName,
      healthState: process.health.state,
      healthScore: process.health.score,
      telemetry,
      recommendations,
    };
  }
}