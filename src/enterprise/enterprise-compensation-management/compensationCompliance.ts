export interface CompensationComplianceRecord {
  requirement: string;
  compliant: boolean;
  reviewedAt: string;
}

export function isCompensationCompliant(
  records: CompensationComplianceRecord[]
): boolean {
  return records.every(
    (record) => record.compliant
  );
}

export function getCompensationGaps(
  records: CompensationComplianceRecord[]
): CompensationComplianceRecord[] {
  return records.filter(
    (record) => !record.compliant
  );
}
