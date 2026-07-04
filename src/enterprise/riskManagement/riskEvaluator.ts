import {
  EnterpriseRiskAssessment,
} from "./riskAssessment";

import {
  EnterpriseRisk,
} from "./riskTypes";

import {
  calculateEnterpriseRiskScore,
} from "./riskScoring";

export class EnterpriseRiskEvaluator {
  evaluate(
    risk: EnterpriseRisk,
    assessment: EnterpriseRiskAssessment,
  ): EnterpriseRiskAssessment {
    const score = calculateEnterpriseRiskScore({
      severity: risk.severity,
      likelihood: risk.likelihood,
    });

    return {
      ...assessment,
      residualRisk: score,
    };
  }
}