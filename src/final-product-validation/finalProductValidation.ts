import type {
  FinalProductValidationContextInput,
} from "./finalProductValidationContext";
import {
  createFinalProductValidationContext,
} from "./finalProductValidationContext";
import {
  validateFinalProduct,
} from "./finalProductValidationValidator";
import {
  evaluateProductReadiness,
} from "./productReadinessEvaluator";
import {
  calculateReleaseReadiness,
} from "./releaseReadinessCalculator";
import {
  analyzeProductionBlockers,
} from "./productionBlockerAnalyzer";
import {
  assessReleaseRisk,
} from "./releaseRiskAssessment";
import {
  buildProductApprovalReport,
} from "./productApprovalReport";
import {
  buildExecutiveSignoffSummary,
} from "./executiveSignoffSummary";
import {
  buildReleaseRecommendation,
} from "./releaseRecommendation";

export function runFinalProductValidation(
  input: FinalProductValidationContextInput,
) {
  const context = createFinalProductValidationContext(input);
  const validation = validateFinalProduct(context);
  const readiness = evaluateProductReadiness(validation);
  const releaseReadiness = calculateReleaseReadiness(validation);
  const blockerAnalysis = analyzeProductionBlockers(validation);
  const riskAssessment = assessReleaseRisk(validation);

  const approvalReport = buildProductApprovalReport({
    validation,
    readiness,
    releaseReadiness,
    blockerAnalysis,
    riskAssessment,
  });

  const executiveSummary = buildExecutiveSignoffSummary({
    validation,
    readiness,
    releaseReadiness,
    blockerAnalysis,
    riskAssessment,
  });

  const releaseRecommendation = buildReleaseRecommendation({
    validation,
    blockerAnalysis,
    riskAssessment,
  });

  return {
    context,
    validation,
    readiness,
    releaseReadiness,
    blockerAnalysis,
    riskAssessment,
    approvalReport,
    executiveSummary,
    releaseRecommendation,
  };
}
