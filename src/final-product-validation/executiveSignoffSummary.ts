import type {
  FinalProductValidationResult,
} from "./finalProductValidationTypes";
import type {
  ProductReadinessEvaluation,
} from "./productReadinessEvaluator";
import type {
  ReleaseReadinessScore,
} from "./releaseReadinessCalculator";
import type {
  ProductionBlockerAnalysis,
} from "./productionBlockerAnalyzer";
import type {
  ReleaseRiskAssessment,
} from "./releaseRiskAssessment";

export interface ExecutiveSignoffSummary {
  headline: string;
  product: string;
  version: string;
  releaseDecision: string;
  overallReadiness: string;
  strongestArea: string;
  weakestArea: string;
  blockerSummary: string;
  riskSummary: string;
  nextAction: string;
}

export interface ExecutiveSignoffSummaryInput {
  validation: FinalProductValidationResult;
  readiness: ProductReadinessEvaluation;
  releaseReadiness: ReleaseReadinessScore;
  blockerAnalysis: ProductionBlockerAnalysis;
  riskAssessment: ReleaseRiskAssessment;
}

export function buildExecutiveSignoffSummary(
  input: ExecutiveSignoffSummaryInput,
): ExecutiveSignoffSummary {
  const strongestArea =
    input.readiness.strongestDimension?.name ?? "Not available";

  const weakestArea =
    input.readiness.weakestDimension?.name ?? "Not available";

  const blockerSummary =
    input.blockerAnalysis.blockers.length === 0
      ? "No production blockers identified."
      : `${input.blockerAnalysis.blockers.length} production blocker(s) require remediation.`;

  const nextAction =
    input.validation.summary.decision === "ready-for-production"
      ? "Approve v1.0 release preparation."
      : input.validation.summary.decision === "ready-for-pilot"
        ? "Approve a controlled pilot and track customer evidence."
        : input.validation.summary.decision === "conditionally-ready"
          ? "Complete pending validations and document release conditions."
          : "Resolve blockers and repeat final product validation.";

  return {
    headline: `KAFU AI ${input.validation.version} Final Product Sign-off`,
    product: input.validation.productName,
    version: input.validation.version,
    releaseDecision: input.validation.summary.decision,
    overallReadiness: `${input.releaseReadiness.score}%`,
    strongestArea,
    weakestArea,
    blockerSummary,
    riskSummary: `${input.riskAssessment.level} release risk`,
    nextAction,
  };
}
