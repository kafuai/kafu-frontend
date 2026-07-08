export interface BenefitComplianceRecord {
  requirement: string;
  compliant: boolean;
  reviewedAt: string;
}

export function isBenefitCompliant(
  records: BenefitComplianceRecord[]
): boolean {
  return records.every(
    (record) => record.compliant
  );
}

export function getBenefitComplianceGaps(
  records: BenefitComplianceRecord[]
): BenefitComplianceRecord[] {
  return records.filter(
    (record) => !record.compliant
  );
}
