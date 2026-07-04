export type ExplainabilityStep = {
  name: string;
  description: string;
  timestamp: string;
};

export type ExplainabilityResult = {
  organizationId: string;
  objective: string;
  steps: ExplainabilityStep[];
};

export class ExplainabilityRuntime {
  generate(
    organizationId: string,
    objective: string,
    steps: ExplainabilityStep[],
  ): ExplainabilityResult {
    return {
      organizationId,
      objective,
      steps,
    };
  }
}