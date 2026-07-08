export interface EmployeeComplianceRecord {
  employeeId: string;
  requirement: string;
  compliant: boolean;
}

export function isEmployeeCompliant(
  records: EmployeeComplianceRecord[]
): boolean {
  return records.every(
    (record) => record.compliant
  );
}

export function getComplianceGaps(
  records: EmployeeComplianceRecord[]
): EmployeeComplianceRecord[] {
  return records.filter(
    (record) => !record.compliant
  );
}
