export interface EmployeeExitManagement {
  employeeId: string;
  exitReason: string;
  assetsReturned: boolean;
  accessRemoved: boolean;
}

export function isEmployeeExitComplete(
  exit: EmployeeExitManagement
): boolean {
  return (
    exit.assetsReturned &&
    exit.accessRemoved
  );
}
