import type { EmployeeLifecycleStatus } from "./employeeLifecycleTypes";

export interface EmployeeOffboarding {
  employeeId: string;
  reason: string;
  status: EmployeeLifecycleStatus;
  completedTasks: string[];
}

export function canOffboardEmployee(
  offboarding: EmployeeOffboarding
): boolean {
  return offboarding.completedTasks.length > 0;
}
