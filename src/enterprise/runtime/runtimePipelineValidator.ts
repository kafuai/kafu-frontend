export type RuntimePipelineValidationInput = {
  organizationId: string;
  objective: string;
  hasContext: boolean;
  hasReasoning: boolean;
  hasDecision: boolean;
  hasRecommendation: boolean;
};

export type RuntimePipelineValidationResult = {
  valid: boolean;
  issues: string[];
};

export class RuntimePipelineValidator {
  validate(
    input: RuntimePipelineValidationInput,
  ): RuntimePipelineValidationResult {
    const issues: string[] = [];

    if (!input.organizationId) {
      issues.push("Organization ID is required.");
    }

    if (!input.objective) {
      issues.push("Objective is required.");
    }

    if (!input.hasContext) {
      issues.push("Enterprise context is missing.");
    }

    if (!input.hasReasoning) {
      issues.push("Executive reasoning output is missing.");
    }

    if (!input.hasDecision) {
      issues.push("Executive decision output is missing.");
    }

    if (!input.hasRecommendation) {
      issues.push("Executive recommendation output is missing.");
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }
}