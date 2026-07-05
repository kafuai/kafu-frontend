import { EmployeeStatus } from "../types/workforceTypes";

export interface EmployeeProfile {
  id: string;
  organizationId: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  status: EmployeeStatus;
  hiredAt: number;
}