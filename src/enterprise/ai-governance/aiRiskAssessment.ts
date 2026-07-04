import {
  AIGovernanceRiskLevel,
  AIUseCaseProfile,
} from "./aiGovernanceTypes";

export interface AIRiskAssessmentResult {
  useCaseId: string;
  riskLevel: AIGovernanceRiskLevel;
  riskScore: number;
  riskFactors: string[];
  mitigationActions: string[];
}

export function assessAIRisk(useCase: AIUseCaseProfile): AIRiskAssessmentResult {
  const riskFactors: string[] = [];
  const mitigationActions: string[] = [];
  let riskScore = 0;

  if (useCase.dataSensitivity === "restricted") {
    riskScore += 30;
    riskFactors.push("Restricted data usage.");
    mitigationActions.push("Require strict access controls and audit logging.");
  }

  if (useCase.dataSensitivity === "confidential") {
    riskScore += 20;
    riskFactors.push("Confidential data usage.");
    mitigationActions.push("Require data minimization and encryption.");
  }

  if (useCase.businessCriticality === "mission_critical") {
    riskScore += 30;
    riskFactors.push("Mission critical business dependency.");
    mitigationActions.push("Require fallback procedures and human approval.");
  }

  if (useCase.automatedDecisionImpact) {
    riskScore += 25;
    riskFactors.push("Automated decision impact.");
    mitigationActions.push("Require explainability and appeal workflow.");
  }

  if (useCase.customerFacing) {
    riskScore += 15;
    riskFactors.push("Customer-facing AI behavior.");
    mitigationActions.push("Require monitoring and response guardrails.");
  }

  const riskLevel: AIGovernanceRiskLevel =
    riskScore >= 80
      ? "critical"
      : riskScore >= 55
        ? "high"
        : riskScore >= 25
          ? "medium"
          : "low";

  return {
    useCaseId: useCase.id,
    riskLevel,
    riskScore,
    riskFactors,
    mitigationActions,
  };
}