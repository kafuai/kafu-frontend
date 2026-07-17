import {
  runFinalProductValidation,
} from "./finalProductValidation";
import {
  KAFU_FINAL_PRODUCT_EVIDENCE,
} from "./kafuFinalProductEvidence";

export const KAFU_FINAL_PRODUCT_SIGNOFF =
  runFinalProductValidation({
    productName: "KAFU AI",
    version: "0.1.0-rc.2",
    evidence: [...KAFU_FINAL_PRODUCT_EVIDENCE],
  });

export const KAFU_FINAL_PRODUCT_VALIDATION_RESULT =
  KAFU_FINAL_PRODUCT_SIGNOFF.validation;

export const KAFU_PRODUCT_READINESS =
  KAFU_FINAL_PRODUCT_SIGNOFF.readiness;

export const KAFU_RELEASE_READINESS =
  KAFU_FINAL_PRODUCT_SIGNOFF.releaseReadiness;

export const KAFU_PRODUCTION_BLOCKERS =
  KAFU_FINAL_PRODUCT_SIGNOFF.blockerAnalysis;

export const KAFU_RELEASE_RISK =
  KAFU_FINAL_PRODUCT_SIGNOFF.riskAssessment;

export const KAFU_PRODUCT_APPROVAL_REPORT =
  KAFU_FINAL_PRODUCT_SIGNOFF.approvalReport;

export const KAFU_EXECUTIVE_SIGNOFF_SUMMARY =
  KAFU_FINAL_PRODUCT_SIGNOFF.executiveSummary;

export const KAFU_RELEASE_RECOMMENDATION =
  KAFU_FINAL_PRODUCT_SIGNOFF.releaseRecommendation;
