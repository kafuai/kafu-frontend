export interface EmployeeTransition {
  employeeId: string;
  previousRole: string;
  newRole: string;
  effectiveDate: string;
}

export function createEmployeeTransition(
  transition: EmployeeTransition
): EmployeeTransition {
  return transition;
}

export function hasRoleChanged(
  transition: EmployeeTransition
): boolean {
  return transition.previousRole !== transition.newRole;
}
