export interface PerformanceComplianceRecord {
  requirement: string;
  compliant: boolean;
  reviewedAt: string;
}

export function isPerformanceCompliant(
  records: PerformanceComplianceRecord[]
): boolean {
  return records.every(
    (record) => record.compliant
  );
}

export function getPerformanceComplianceGaps(
  records: PerformanceComplianceRecord[]
): PerformanceComplianceRecord[] {
  return records.filter(
    (record) => !record.compliant
  );
}
