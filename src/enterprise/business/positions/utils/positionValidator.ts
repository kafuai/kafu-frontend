import { CreatePositionInput } from "../types/positionTypes";

export class PositionValidator {
  validateCreateInput(input: CreatePositionInput): boolean {
    return Boolean(
      input.id.trim() &&
      input.organizationId.trim() &&
      input.departmentId.trim() &&
      input.title.trim() &&
      input.code.trim()
    );
  }
}