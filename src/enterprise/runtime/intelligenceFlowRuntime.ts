import {
  ExplainabilityRuntime,
  ExplainabilityStep,
  ExplainabilityResult,
} from "./explainabilityRuntime";

import {
  RuntimePipelineValidator,
  RuntimePipelineValidationInput,
  RuntimePipelineValidationResult,
} from "./runtimePipelineValidator";

export type IntelligenceFlowRuntimeInput = RuntimePipelineValidationInput & {
  explainabilitySteps: ExplainabilityStep[];
};

export type IntelligenceFlowRuntimeResult = {
  validation: RuntimePipelineValidationResult;
  explainability: ExplainabilityResult | null;
};

export class IntelligenceFlowRuntime {
  private readonly validator = new RuntimePipelineValidator();
  private readonly explainability = new ExplainabilityRuntime();

  run(input: IntelligenceFlowRuntimeInput): IntelligenceFlowRuntimeResult {
    const validation = this.validator.validate(input);

    if (!validation.valid) {
      return {
        validation,
        explainability: null,
      };
    }

    return {
      validation,
      explainability: this.explainability.generate(
        input.organizationId,
        input.objective,
        input.explainabilitySteps,
      ),
    };
  }
}