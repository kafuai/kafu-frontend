export interface SupplierComplianceRecord {
  supplierId: string;
  standard: string;
  compliant: boolean;
  reviewedAt: string;
}

export function isSupplierCompliant(
  records: SupplierComplianceRecord[]
): boolean {
  return records.every(
    (record) => record.compliant
  );
}

export function getComplianceGaps(
  records: SupplierComplianceRecord[]
): SupplierComplianceRecord[] {
  return records.filter(
    (record) => !record.compliant
  );
}
