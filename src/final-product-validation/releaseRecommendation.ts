import type {
  FinalProductReleaseDecision,
  FinalProductValidationResult,
} from "./finalProductValidationTypes";
import type {
  ProductionBlockerAnalysis,
} from "./productionBlockerAnalyzer";
import type {
  ReleaseRiskAssessment,
} from "./releaseRiskAssessment";

export interface ReleaseRecommendation {
  decision: FinalProductReleaseDecision;
  releaseAuthorized: boolean;
  recommendedReleaseType:
    | "production"
    | "controlled-pilot"
    | "conditional-release"
    | "no-release";
  rationale: string[];
  mandatoryActions: string[];
}

export interface ReleaseRecommendationInput {
  validation: FinalProductValidationResult;
  blockerAnalysis: ProductionBlockerAnalysis;
  riskAssessment: ReleaseRiskAssessment;
}

export function buildReleaseRecommendation(
  input: ReleaseRecommendationInput,
): ReleaseRecommendation {
  const decision = input.validation.summary.decision;
  const mandatoryActions: string[] = [];

  if (input.blockerAnalysis.releaseBlocked) {
    mandatoryActions.push(
      ...input.blockerAnalysis.blockers.map(
        (blocker) => `Resolve: ${blocker.title}`,
      ),
    );
  }

  if (input.validation.summary.pendingRequirements > 0) {
    mandatoryActions.push(
      `Complete ${input.validation.summary.pendingRequirements} pending validation requirement(s).`,
    );
  }

  const rationale = [
    `Overall product validation score: ${input.validation.summary.overallScore}%.`,
    `Blocking issues: ${input.validation.summary.blockingIssues}.`,
    `Release risk level: ${input.riskAssessment.level}.`,
    input.riskAssessment.releaseRecommendation,
  ];

  if (
    decision === "ready-for-production" &&
    !input.blockerAnalysis.releaseBlocked
  ) {
    return {
      decision,
      releaseAuthorized: true,
      recommendedReleaseType: "production",
      rationale,
      mandatoryActions,
    };
  }

  if (
    decision === "ready-for-pilot" &&
    !input.blockerAnalysis.releaseBlocked
  ) {
    return {
      decision,
      releaseAuthorized: true,
      recommendedReleaseType: "controlled-pilot",
      rationale,
      mandatoryActions,
    };
  }

  if (
    decision === "conditionally-ready" &&
    !input.blockerAnalysis.releaseBlocked
  ) {
    return {
      decision,
      releaseAuthorized: true,
      recommendedReleaseType: "conditional-release",
      rationale,
      mandatoryActions,
    };
  }

  return {
    decision,
    releaseAuthorized: false,
    recommendedReleaseType: "no-release",
    rationale,
    mandatoryActions,
  };
}
