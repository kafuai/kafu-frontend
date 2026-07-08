export interface SupplierAuditRecord {
  supplierId: string;
  auditor: string;
  findings: string[];
  completedAt: string;
}

export function hasSupplierAuditIssues(
  audit: SupplierAuditRecord
): boolean {
  return audit.findings.length > 0;
}

export function summarizeSupplierAudit(
  audit: SupplierAuditRecord
): string {
  return audit.findings.length
    ? `${audit.findings.length} issues identified`
    : "No issues identified";
}
