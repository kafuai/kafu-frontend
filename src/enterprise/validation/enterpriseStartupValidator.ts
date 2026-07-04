import {
  EnterpriseStartupValidationContext,
  EnterpriseStartupValidationResult,
} from "./enterpriseStartupValidationTypes";

export class EnterpriseStartupValidator {
  validate(
    context: EnterpriseStartupValidationContext,
  ): EnterpriseStartupValidationResult {
    const errors: string[] = [];

    if (context.providerCount === 0) {
      errors.push("No dependency injection providers registered.");
    }

    if (context.runtimeStatus === "failed") {
      errors.push("Runtime is already in a failed state.");
    }

    return {
      valid: errors.length === 0,
      errors,
      checkedAt: new Date().toISOString(),
    };
  }
}