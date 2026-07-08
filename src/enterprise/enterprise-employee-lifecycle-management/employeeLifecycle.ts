import type {
  EmployeeLifecycle,
  EmployeeLifecycleStatus,
} from "./employeeLifecycleTypes";

export function createEmployeeLifecycle(
  lifecycle: EmployeeLifecycle
): EmployeeLifecycle {
  return {
    ...lifecycle,
    updatedAt: new Date().toISOString(),
  };
}

export function updateEmployeeLifecycleStatus(
  lifecycle: EmployeeLifecycle,
  status: EmployeeLifecycleStatus
): EmployeeLifecycle {
  return {
    ...lifecycle,
    status,
    updatedAt: new Date().toISOString(),
  };
}

export function isEmployeeActive(
  lifecycle: EmployeeLifecycle
): boolean {
  return lifecycle.status === "active";
}
