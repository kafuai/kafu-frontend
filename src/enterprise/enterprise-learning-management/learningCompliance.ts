export interface LearningComplianceRecord {
  requirement: string;
  compliant: boolean;
  reviewedAt: string;
}

export function isLearningCompliant(
  records: LearningComplianceRecord[]
): boolean {
  return records.every(
    (record) => record.compliant
  );
}

export function getLearningComplianceGaps(
  records: LearningComplianceRecord[]
): LearningComplianceRecord[] {
  return records.filter(
    (record) => !record.compliant
  );
}
