import type {
  FinalProductReleaseDecision,
  FinalProductValidationResult,
} from "./finalProductValidationTypes";

export interface ReleaseReadinessScore {
  score: number;
  engineeringScore: number;
  productScore: number;
  commercialScore: number;
  operationalScore: number;
  decision: FinalProductReleaseDecision;
}

const CATEGORY_WEIGHTS: Readonly<Record<string, number>> = {
  engineering: 0.2,
  architecture: 0.15,
  product: 0.2,
  experience: 0.15,
  security: 0.1,
  operations: 0.1,
  commercial: 0.05,
  "go-to-market": 0.05,
};

function getCategoryScore(
  result: FinalProductValidationResult,
  category: string,
): number {
  return (
    result.categoryResults.find(
      (categoryResult) => categoryResult.category === category,
    )?.score ?? 0
  );
}

function calculateWeightedScore(
  result: FinalProductValidationResult,
): number {
  const weightedScore = result.categoryResults.reduce(
    (total, categoryResult) => {
      const weight = CATEGORY_WEIGHTS[categoryResult.category] ?? 0;

      return total + categoryResult.score * weight;
    },
    0,
  );

  return Math.max(0, Math.min(100, Math.round(weightedScore)));
}

export function calculateReleaseReadiness(
  result: FinalProductValidationResult,
): ReleaseReadinessScore {
  const engineeringScore = Math.round(
    (
      getCategoryScore(result, "engineering") +
      getCategoryScore(result, "architecture")
    ) / 2,
  );

  const productScore = Math.round(
    (
      getCategoryScore(result, "product") +
      getCategoryScore(result, "experience")
    ) / 2,
  );

  const commercialScore = Math.round(
    (
      getCategoryScore(result, "commercial") +
      getCategoryScore(result, "go-to-market")
    ) / 2,
  );

  const operationalScore = Math.round(
    (
      getCategoryScore(result, "security") +
      getCategoryScore(result, "operations")
    ) / 2,
  );

  return {
    score: calculateWeightedScore(result),
    engineeringScore,
    productScore,
    commercialScore,
    operationalScore,
    decision: result.summary.decision,
  };
}
