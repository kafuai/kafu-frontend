import type {
  FinalProductValidationFinding,
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

export interface ProductApprovalReport {
  productName: string;
  version: string;
  evaluatedAt: string;
  approved: boolean;
  decision: FinalProductValidationResult["summary"]["decision"];
  overallScore: number;
  releaseReadinessScore: number;
  readinessStatus: ProductReadinessEvaluation["status"];
  riskLevel: ReleaseRiskAssessment["level"];
  blockers: FinalProductValidationFinding[];
  approvalStatement: string;
}

export interface ProductApprovalReportInput {
  validation: FinalProductValidationResult;
  readiness: ProductReadinessEvaluation;
  releaseReadiness: ReleaseReadinessScore;
  blockerAnalysis: ProductionBlockerAnalysis;
  riskAssessment: ReleaseRiskAssessment;
}

function buildApprovalStatement(
  input: ProductApprovalReportInput,
): string {
  if (input.blockerAnalysis.releaseBlocked) {
    return "Product approval is withheld until all blocking validation issues are resolved.";
  }

  if (input.validation.summary.decision === "ready-for-production") {
    return "The product is approved for the formal production release process.";
  }

  if (input.validation.summary.decision === "ready-for-pilot") {
    return "The product is approved for a controlled customer pilot.";
  }

  return "The product is conditionally approved subject to documented remediation actions.";
}

export function buildProductApprovalReport(
  input: ProductApprovalReportInput,
): ProductApprovalReport {
  const approved =
    !input.blockerAnalysis.releaseBlocked &&
    input.validation.summary.decision !== "hold-release";

  return {
    productName: input.validation.productName,
    version: input.validation.version,
    evaluatedAt: input.validation.evaluatedAt,
    approved,
    decision: input.validation.summary.decision,
    overallScore: input.validation.summary.overallScore,
    releaseReadinessScore: input.releaseReadiness.score,
    readinessStatus: input.readiness.status,
    riskLevel: input.riskAssessment.level,
    blockers: input.validation.blockers,
    approvalStatement: buildApprovalStatement(input),
  };
}
