import { SecurityAuditRecord } from "./securityTypes";

export function createSecurityAuditRecord(
  record: SecurityAuditRecord,
): SecurityAuditRecord {
  return {
    ...record,
  };
}