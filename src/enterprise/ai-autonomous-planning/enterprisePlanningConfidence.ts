import {
  EnterprisePlanningConstraint,
  EnterprisePlanningResource,
  EnterprisePlanningRisk,
  EnterprisePlanningStep,
} from "./enterpriseAIPlanningEngineTypes";

export function calculateEnterprisePlanningConfidence(input: {
  steps: EnterprisePlanningStep[];
  constraints: EnterprisePlanningConstraint[];
  resources: EnterprisePlanningResource[];
  risks: EnterprisePlanningRisk[];
}): number {
  const stepScore = input.steps.length > 0 ? 0.3 : 0;
  const resourceScore = input.resources.some((resource) => resource.required)
    ? 0.2
    : 0.1;
  const constraintPenalty = input.constraints.some((constraint) => constraint.isBlocking)
    ? 0.25
    : 0;
  const riskPenalty = input.risks.reduce(
    (sum, risk) => sum + risk.probability * risk.impact,
    0
  ) / Math.max(input.risks.length, 1);

  const confidence = 0.5 + stepScore + resourceScore - constraintPenalty - riskPenalty * 0.2;

  return Number(Math.max(0, Math.min(1, confidence)).toFixed(2));
}