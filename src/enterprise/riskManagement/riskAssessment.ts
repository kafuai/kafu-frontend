import { EnterpriseRisk } from "./riskTypes";
import { EnterpriseRiskScore } from "./riskScoring";

export interface EnterpriseRiskAssessment {
  assessmentId: string;
  riskId: string;
  assessorId: string;
  assessedAt: string;

  inherentRisk: EnterpriseRiskScore;
  residualRisk: EnterpriseRiskScore;

  assumptions: string[];
  observations: string[];
  recommendations: string[];

  nextReviewDate?: string;
}

export interface EnterpriseRiskAssessmentResult {
  risk: EnterpriseRisk;
  assessment: EnterpriseRiskAssessment;
}