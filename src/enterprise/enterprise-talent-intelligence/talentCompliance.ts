export interface TalentComplianceRecord {
  requirement: string;
  compliant: boolean;
  reviewedAt: string;
}

export function isTalentCompliant(
  records: TalentComplianceRecord[]
): boolean {
  return records.every(
    (record) => record.compliant
  );
}

export function getTalentComplianceGaps(
  records: TalentComplianceRecord[]
): TalentComplianceRecord[] {
  return records.filter(
    (record) => !record.compliant
  );
}
