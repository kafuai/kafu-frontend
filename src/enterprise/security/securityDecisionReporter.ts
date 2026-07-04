import { SecurityDecisionHistoryRecord } from "./securityDecisionHistory";

export interface SecurityDecisionReport {
  totalDecisions: number;
  allowedDecisions: number;
  deniedDecisions: number;
  generatedAt: Date;
}

export function createSecurityDecisionReport(
  records: SecurityDecisionHistoryRecord[],
): SecurityDecisionReport {
  return {
    totalDecisions: records.length,
    allowedDecisions: records.filter(
      (record) => record.result.decision === "allow",
    ).length,
    deniedDecisions: records.filter(
      (record) => record.result.decision === "deny",
    ).length,
    generatedAt: new Date(),
  };
}