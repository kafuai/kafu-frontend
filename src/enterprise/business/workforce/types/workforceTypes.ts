export type EmployeeStatus =
  | "active"
  | "inactive"
  | "onboarding"
  | "terminated"
  | "leave";

export interface CreateEmployeeInput {
  id: string;
  organizationId: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
}