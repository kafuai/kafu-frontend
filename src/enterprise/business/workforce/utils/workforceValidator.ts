import { CreateEmployeeInput } from "../types/workforceTypes";

export class WorkforceValidator {
  validateCreateInput(input: CreateEmployeeInput): boolean {
    return Boolean(
      input.id &&
        input.organizationId &&
        input.employeeNumber &&
        input.firstName &&
        input.lastName &&
        input.email &&
        input.department &&
        input.position,
    );
  }
}