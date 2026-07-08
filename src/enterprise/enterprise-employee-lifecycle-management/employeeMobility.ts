export interface EmployeeMobility {
  employeeId: string;
  fromDepartment: string;
  toDepartment: string;
  approved: boolean;
}

export function isMobilityApproved(
  mobility: EmployeeMobility
): boolean {
  return mobility.approved;
}
