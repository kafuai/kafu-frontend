import { AIGovernancePolicy, AIUseCaseProfile } from "./aiGovernanceTypes";
import { classifyAIUseCase } from "./aiUseCaseClassifier";
import { evaluateAIPolicyCompliance } from "./aiPolicyEvaluation";
import { assessAIRisk } from "./aiRiskAssessment";

export interface AIGovernanceEngineResult {
  organizationId: string;
  useCaseId: string;
  riskAssessment: ReturnType<typeof assessAIRisk>;
  classification: ReturnType<typeof classifyAIUseCase>;
  policyEvaluations: ReturnType<typeof evaluateAIPolicyCompliance>[];
  approved: boolean;
  requiresReview: boolean;
  generatedAt: Date;
}

export function evaluateAIGovernance(
  organizationId: string,
  useCase: AIUseCaseProfile,
  policies: AIGovernancePolicy[],
): AIGovernanceEngineResult {
  const riskAssessment = assessAIRisk(useCase);
  const classification = classifyAIUseCase(useCase);
  const applicablePolicies = policies.filter(
    (policy) => policy.organizationId === organizationId,
  );

  const policyEvaluations = applicablePolicies.map((policy) =>
    evaluateAIPolicyCompliance(policy, useCase),
  );

  const hasViolation = policyEvaluations.some(
    (evaluation) => evaluation.outcome === "non_compliant",
  );

  const requiresReview =
    classification.requiresHumanOversight ||
    policyEvaluations.some(
      (evaluation) => evaluation.outcome === "requires_review",
    );

  return {
    organizationId,
    useCaseId: useCase.id,
    riskAssessment,
    classification,
    policyEvaluations,
    approved: !hasViolation && !requiresReview,
    requiresReview,
    generatedAt: new Date(),
  };
}