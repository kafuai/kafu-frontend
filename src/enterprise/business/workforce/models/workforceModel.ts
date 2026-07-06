import { EmployeeStatus } from "../types/workforceTypes";

export interface EmployeeProfile {
  readonly id: string;

  readonly organizationId: string;

  readonly employeeNumber: string;

  readonly firstName: string;
  readonly lastName: string;

  readonly email: string;

  readonly departmentId: string;
  readonly positionId: string;

  readonly managerEmployeeId?: string;

  readonly status: EmployeeStatus;

  readonly hiredAt: number;
}