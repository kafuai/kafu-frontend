import { calculateEnterpriseRiskScore } from "./riskScoring";
import {
  EnterpriseRisk,
} from "./riskTypes";
import {
  EnterpriseRiskAssessment,
} from "./riskAssessment";

export class EnterpriseRiskAssessmentFactory {
  create(
    risk: EnterpriseRisk,
    assessorId: string,
  ): EnterpriseRiskAssessment {
    const score = calculateEnterpriseRiskScore({
      severity: risk.severity,
      likelihood: risk.likelihood,
    });

    return {
      assessmentId: crypto.randomUUID(),
      riskId: risk.riskId,
      assessorId,
      assessedAt: new Date().toISOString(),
      inherentRisk: score,
      residualRisk: score,
      assumptions: [],
      observations: [],
      recommendations: [],
    };
  }
}