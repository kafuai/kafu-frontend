import { AIAutonomousExecutionAuditEvent } from "./aiAutonomousExecutionAuditTypes";
import {
  AIAutonomousExecutionAuditStatistics,
  calculateAIAutonomousExecutionAuditStatistics,
} from "./aiExecutionAuditStatistics";
import {
  AIAutonomousExecutionAuditIntegrityReport,
  verifyAIAutonomousExecutionAuditIntegrity,
} from "./aiExecutionAuditIntegrity";

export interface AIAutonomousExecutionAuditAggregate {
  statistics: AIAutonomousExecutionAuditStatistics;
  integrity: AIAutonomousExecutionAuditIntegrityReport;
  riskLevel: "low" | "medium" | "high";
}

export function aggregateAIAutonomousExecutionAuditEvents(
  events: AIAutonomousExecutionAuditEvent[],
): AIAutonomousExecutionAuditAggregate {
  const statistics = calculateAIAutonomousExecutionAuditStatistics(events);
  const integrity = verifyAIAutonomousExecutionAuditIntegrity(events);

  const riskScore =
    statistics.severityBreakdown.critical * 3 +
    statistics.severityBreakdown.warning * 2 +
    statistics.outcomeBreakdown.failed * 3 +
    statistics.outcomeBreakdown.requires_review * 2 +
    integrity.issues.length * 2;

  return {
    statistics,
    integrity,
    riskLevel: riskScore >= 10 ? "high" : riskScore >= 4 ? "medium" : "low",
  };
}