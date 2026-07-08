export interface HRComplianceRecord {
  employeeId: string;
  requirement: string;
  compliant: boolean;
}

export function isHRCompliant(
  records: HRComplianceRecord[]
): boolean {
  return records.every(
    (record) => record.compliant
  );
}

export function getHRComplianceGaps(
  records: HRComplianceRecord[]
): HRComplianceRecord[] {
  return records.filter(
    (record) => !record.compliant
  );
}
