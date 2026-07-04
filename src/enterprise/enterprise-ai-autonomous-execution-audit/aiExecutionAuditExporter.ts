import { AIAutonomousExecutionAuditTrail } from "./aiExecutionAuditTrail";

export interface AIAutonomousExecutionAuditExport {
  exportedAt: string;
  version: string;
  trail: AIAutonomousExecutionAuditTrail;
}

export function exportAIAutonomousExecutionAuditTrail(
  trail: AIAutonomousExecutionAuditTrail,
): string {
  const payload: AIAutonomousExecutionAuditExport = {
    exportedAt: new Date().toISOString(),
    version: "1.0",
    trail,
  };

  return JSON.stringify(payload, null, 2);
}