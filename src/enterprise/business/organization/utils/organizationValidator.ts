import { CreateOrganizationInput } from "../types/organizationTypes";

export class OrganizationValidator {
  validateCreateInput(input: CreateOrganizationInput): boolean {
    return Boolean(
      input.id &&
      input.name.trim() &&
      input.industry.trim() &&
      input.size &&
      (!input.legal ||
        (
          input.legal.legalName.trim() &&
          input.legal.country.trim()
        ))
    );
  }
}