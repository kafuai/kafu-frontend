import { CreateOrganizationInput } from "../types/organizationTypes";

export class OrganizationValidator {
  validateCreateInput(input: CreateOrganizationInput): boolean {
    return Boolean(
      input.id &&
        input.name &&
        input.industry &&
        input.size,
    );
  }
}