import { PlatformConfiguration } from "./platformConfiguration";

export type PlatformConfigurationValidationResult = {
  valid: boolean;
  errors: string[];
};

export class PlatformConfigurationValidator {
  validate(
    configuration: PlatformConfiguration,
    requiredKeys: string[],
  ): PlatformConfigurationValidationResult {
    const errors: string[] = [];

    for (const key of requiredKeys) {
      if (!configuration.has(key)) {
        errors.push(`Missing configuration: ${key}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}