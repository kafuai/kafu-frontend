import { CreateEmployeeInput } from "../types/workforceTypes";

export class WorkforceValidator {
  validateCreateInput(input: CreateEmployeeInput): boolean {
    return Boolean(
      input.id.trim() &&
        input.organizationId.trim() &&
        input.employeeNumber.trim() &&
        input.firstName.trim() &&
        input.lastName.trim() &&
        input.email.trim() &&
        input.departmentId.trim() &&
        input.positionId.trim()
    );
  }
}