import { CreateDepartmentInput } from "../types/departmentTypes";

export class DepartmentValidator {
  validateCreateInput(input: CreateDepartmentInput): boolean {
    return Boolean(
      input.id.trim() &&
      input.organizationId.trim() &&
      input.name.trim() &&
      input.code.trim()
    );
  }
}