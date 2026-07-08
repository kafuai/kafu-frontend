export interface WorkforceComplianceRecord {
  workforceArea: string;
  requirement: string;
  compliant: boolean;
}

export function isWorkforceCompliant(
  records: WorkforceComplianceRecord[]
): boolean {
  return records.every(
    (record) => record.compliant
  );
}

export function getWorkforceComplianceGaps(
  records: WorkforceComplianceRecord[]
): WorkforceComplianceRecord[] {
  return records.filter(
    (record) => !record.compliant
  );
}
