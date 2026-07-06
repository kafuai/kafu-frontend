export type EmployeeStatus =
  | "active"
  | "inactive"
  | "onboarding"
  | "terminated"
  | "leave";

export interface CreateEmployeeInput {
  readonly id: string;
  readonly organizationId: string;

  readonly employeeNumber: string;

  readonly firstName: string;
  readonly lastName: string;

  readonly email: string;

  readonly departmentId: string;
  readonly positionId: string;

  readonly managerEmployeeId?: string;

  readonly hireDate?: number;
}