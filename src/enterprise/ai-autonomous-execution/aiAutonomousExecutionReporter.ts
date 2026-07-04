import { AIAutonomousExecutionAuditRecord } from "./aiAutonomousExecutionAudit";

export interface AIAutonomousExecutionReport {
  generatedAt: Date;
  summary: string;
  audit: AIAutonomousExecutionAuditRecord;
}

export function createAIAutonomousExecutionReport(
  audit: AIAutonomousExecutionAuditRecord,
): AIAutonomousExecutionReport {
  return {
    generatedAt: new Date(),
    summary:
      `Execution ${audit.executionId} finished with status ${audit.status}. ` +
      `Executed=${audit.executedTasks}, ` +
      `Approval=${audit.waitingApprovalTasks}, ` +
      `Blocked=${audit.blockedTasks}, ` +
      `Skipped=${audit.skippedTasks}`,
    audit,
  };
}