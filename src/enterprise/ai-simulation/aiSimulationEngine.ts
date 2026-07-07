import { AISimulationInput } from "./aiSimulationInput";
import { AISimulationScenario } from "./aiSimulationScenario";
import { AISimulationVariant } from "./aiSimulationVariant";

export interface AISimulationEngineInput {
  scenario: AISimulationScenario;
  input: AISimulationInput;
  variants: AISimulationVariant[];
}

export interface AISimulationEngineResult {
  scenarioId: string;
  variantResults: AISimulationVariantResult[];
  bestVariantId?: string;
}

export interface AISimulationVariantResult {
  variantId: string;
  projectedScore: number;
  confidenceScore: number;
  riskScore: number;
  summary: string;
}

export function runAISimulationEngine(
  engineInput: AISimulationEngineInput,
): AISimulationEngineResult {
  const variantResults = engineInput.variants.map((variant) => {
    const impactScore =
      variant.changes.reduce((total, change) => total + change.expectedImpact, 0) /
      Math.max(variant.changes.length, 1);

    const uncertainty =
      engineInput.input.factors.reduce((total, factor) => total + factor.uncertainty, 0) /
      Math.max(engineInput.input.factors.length, 1);

    const projectedScore = Math.round(Math.max(0, Math.min(1, impactScore)) * 100);
    const confidenceScore = Math.round((1 - Math.max(0, Math.min(1, uncertainty))) * 100);
    const riskScore = Math.round(
      variant.changes.reduce((total, change) => {
        if (change.riskLevel === "critical") return total + 1;
        if (change.riskLevel === "high") return total + 0.75;
        if (change.riskLevel === "medium") return total + 0.5;
        return total + 0.25;
      }, 0) / Math.max(variant.changes.length, 1) * 100,
    );

    return {
      variantId: variant.id,
      projectedScore,
      confidenceScore,
      riskScore,
      summary: variant.expectedOutcome,
    };
  });

  const bestVariant = [...variantResults].sort(
    (a, b) =>
      b.projectedScore +
      b.confidenceScore -
      b.riskScore -
      (a.projectedScore + a.confidenceScore - a.riskScore),
  )[0];

  return {
    scenarioId: engineInput.scenario.id,
    variantResults,
    bestVariantId: bestVariant?.variantId,
  };
}
