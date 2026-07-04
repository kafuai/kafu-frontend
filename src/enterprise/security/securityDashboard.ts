import { SecurityAuditRecord } from "./securityTypes";
import {
  SecurityComplianceSnapshot,
  createSecurityComplianceSnapshot,
} from "./securityCompliance";
import {
  SecurityDecisionHistoryRecord,
} from "./securityDecisionHistory";
import {
  SecurityDecisionReport,
  createSecurityDecisionReport,
} from "./securityDecisionReporter";

export interface SecurityDashboardSnapshot {
  compliance: SecurityComplianceSnapshot;
  decisionReport: SecurityDecisionReport;
  generatedAt: Date;
}

export function createSecurityDashboardSnapshot(
  organizationId: string,
  auditRecords: SecurityAuditRecord[],
  decisionHistory: SecurityDecisionHistoryRecord[],
): SecurityDashboardSnapshot {
  return {
    compliance: createSecurityComplianceSnapshot(
      organizationId,
      auditRecords,
    ),
    decisionReport: createSecurityDecisionReport(
      decisionHistory,
    ),
    generatedAt: new Date(),
  };
}