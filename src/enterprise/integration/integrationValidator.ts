import { IntegrationDefinition } from "./integrationTypes";

export class IntegrationValidator {
  validate(integration: IntegrationDefinition): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!integration.id) {
      errors.push("Integration id is required.");
    }

    if (!integration.organizationId) {
      errors.push("Organization id is required.");
    }

    if (!integration.name) {
      errors.push("Integration name is required.");
    }

    if (!integration.provider) {
      errors.push("Integration provider is required.");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}