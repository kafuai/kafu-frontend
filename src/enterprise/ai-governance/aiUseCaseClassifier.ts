import {
  AIGovernanceRiskLevel,
  AIUseCaseProfile,
} from "./aiGovernanceTypes";

export interface AIUseCaseClassificationResult {
  useCaseId: string;
  riskLevel: AIGovernanceRiskLevel;
  reasons: string[];
  requiresHumanOversight: boolean;
  requiresExplainability: boolean;
  requiresAuditTrail: boolean;
}

export function classifyAIUseCase(
  useCase: AIUseCaseProfile,
): AIUseCaseClassificationResult {
  const reasons: string[] = [];
  let score = 0;

  if (useCase.dataSensitivity === "restricted") {
    score += 4;
    reasons.push("Restricted data is involved.");
  }

  if (useCase.dataSensitivity === "confidential") {
    score += 3;
    reasons.push("Confidential data is involved.");
  }

  if (useCase.businessCriticality === "mission_critical") {
    score += 4;
    reasons.push("Use case is mission critical.");
  }

  if (useCase.businessCriticality === "high") {
    score += 3;
    reasons.push("Use case has high business criticality.");
  }

  if (useCase.automatedDecisionImpact) {
    score += 4;
    reasons.push("Use case may impact automated decisions.");
  }

  if (useCase.customerFacing) {
    score += 2;
    reasons.push("Use case is customer facing.");
  }

  const riskLevel: AIGovernanceRiskLevel =
    score >= 9 ? "critical" : score >= 6 ? "high" : score >= 3 ? "medium" : "low";

  return {
    useCaseId: useCase.id,
    riskLevel,
    reasons,
    requiresHumanOversight: riskLevel === "high" || riskLevel === "critical",
    requiresExplainability: riskLevel !== "low",
    requiresAuditTrail: true,
  };
}