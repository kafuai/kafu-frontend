import type {
  FinalProductCategoryResult,
  FinalProductValidationFinding,
  FinalProductValidationResult,
} from "./finalProductValidationTypes";

export interface ProductReadinessDimension {
  name: string;
  score: number;
  status: "ready" | "at-risk" | "not-ready";
  blockingIssues: number;
}

export interface ProductReadinessEvaluation {
  overallScore: number;
  status: "ready" | "at-risk" | "not-ready";
  dimensions: ProductReadinessDimension[];
  strongestDimension?: ProductReadinessDimension;
  weakestDimension?: ProductReadinessDimension;
}

function resolveDimensionStatus(
  score: number,
  blockingIssues: number,
): ProductReadinessDimension["status"] {
  if (blockingIssues > 0 || score < 70) {
    return "not-ready";
  }

  if (score < 90) {
    return "at-risk";
  }

  return "ready";
}

function buildDimension(
  category: FinalProductCategoryResult,
): ProductReadinessDimension {
  return {
    name: category.category,
    score: category.score,
    status: resolveDimensionStatus(
      category.score,
      category.blockingIssues,
    ),
    blockingIssues: category.blockingIssues,
  };
}

function countBlockingFindings(
  findings: FinalProductValidationFinding[],
): number {
  return findings.filter((finding) => finding.blocking).length;
}

export function evaluateProductReadiness(
  result: FinalProductValidationResult,
): ProductReadinessEvaluation {
  const dimensions = result.categoryResults.map(buildDimension);

  const strongestDimension =
    dimensions.length > 0
      ? [...dimensions].sort((left, right) => right.score - left.score)[0]
      : undefined;

  const weakestDimension =
    dimensions.length > 0
      ? [...dimensions].sort((left, right) => left.score - right.score)[0]
      : undefined;

  const blockingIssues = countBlockingFindings(result.findings);

  return {
    overallScore: result.summary.overallScore,
    status: resolveDimensionStatus(
      result.summary.overallScore,
      blockingIssues,
    ),
    dimensions,
    strongestDimension,
    weakestDimension,
  };
}
