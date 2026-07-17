import {
  EnterpriseDecisionConfidence,
  EnterpriseDecisionEvidence,
  EnterpriseDecisionImpact,
  EnterpriseDecisionOption,
  EnterpriseDecisionPriority,
  EnterpriseDecisionRisk,
} from "./decisionIntelligenceTypes";

export interface EnterpriseDecisionEngineInput {
  organizationId: string;
  decisionId: string;
  decisionTitle: string;
  businessArea: string;
  urgencyScore: number;
  strategicAlignmentScore: number;
  financialImpactScore: number;
  operationalImpactScore: number;
  evidence: EnterpriseDecisionEvidence[];
  risks: EnterpriseDecisionRisk[];
  options: EnterpriseDecisionOption[];
}

export interface EnterpriseDecisionEngineResult {
  priority: EnterpriseDecisionPriority;
  confidence: EnterpriseDecisionConfidence;
  expectedImpact: EnterpriseDecisionImpact;
  recommendedOption: EnterpriseDecisionOption | null;
  decisionScore: number;
  reasoningSummary: string;
}

function normalizeScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function calculateEvidenceConfidence(
  evidence: EnterpriseDecisionEvidence[],
): EnterpriseDecisionConfidence {
  if (evidence.length === 0) {
    return "low";
  }

  const averageReliability =
    evidence.reduce(
      (total, item) => total + normalizeScore(item.reliabilityScore),
      0,
    ) / evidence.length;

  if (evidence.length >= 5 && averageReliability >= 75) {
    return "high";
  }

  if (evidence.length >= 2 && averageReliability >= 50) {
    return "medium";
  }

  return "low";
}

function calculatePriority(
  urgencyScore: number,
  strategicAlignmentScore: number,
  financialImpactScore: number,
): EnterpriseDecisionPriority {
  const weightedScore =
    normalizeScore(urgencyScore) * 0.45 +
    normalizeScore(strategicAlignmentScore) * 0.3 +
    normalizeScore(financialImpactScore) * 0.25;

  if (weightedScore >= 80) {
    return "critical";
  }

  if (weightedScore >= 65) {
    return "high";
  }

  if (weightedScore >= 40) {
    return "medium";
  }

  return "low";
}

function calculateImpact(
  strategicAlignmentScore: number,
  financialImpactScore: number,
  operationalImpactScore: number,
): EnterpriseDecisionImpact {
  const impactScore =
    normalizeScore(strategicAlignmentScore) * 0.4 +
    normalizeScore(financialImpactScore) * 0.35 +
    normalizeScore(operationalImpactScore) * 0.25;

  if (impactScore >= 85) {
    return "transformational";
  }

  if (impactScore >= 65) {
    return "strategic";
  }

  if (impactScore >= 40) {
    return "operational";
  }

  return "limited";
}

function selectRecommendedOption(
  options: EnterpriseDecisionOption[],
): EnterpriseDecisionOption | null {
  if (options.length === 0) {
    return null;
  }

  return [...options].sort((firstOption, secondOption) => {
    const firstScore =
      normalizeScore(firstOption.estimatedValueScore) -
      normalizeScore(firstOption.riskScore) * 0.5;

    const secondScore =
      normalizeScore(secondOption.estimatedValueScore) -
      normalizeScore(secondOption.riskScore) * 0.5;

    return secondScore - firstScore;
  })[0];
}

export class EnterpriseDecisionEngine {
  evaluate(
    input: EnterpriseDecisionEngineInput,
  ): EnterpriseDecisionEngineResult {
    const priority = calculatePriority(
      input.urgencyScore,
      input.strategicAlignmentScore,
      input.financialImpactScore,
    );

    const confidence = calculateEvidenceConfidence(input.evidence);

    const expectedImpact = calculateImpact(
      input.strategicAlignmentScore,
      input.financialImpactScore,
      input.operationalImpactScore,
    );

    const recommendedOption = selectRecommendedOption(input.options);

    const decisionScore = normalizeScore(
      input.urgencyScore * 0.3 +
        input.strategicAlignmentScore * 0.3 +
        input.financialImpactScore * 0.25 +
        input.operationalImpactScore * 0.15,
    );

    const activeCriticalRisks = input.risks.filter(
      (risk) => risk.severity === "critical",
    ).length;

    const reasoningSummary = recommendedOption
      ? `${recommendedOption.title} is the strongest available option for ${input.decisionTitle}. The decision carries ${priority} priority, ${expectedImpact} expected impact, and ${confidence} confidence based on the available enterprise evidence.${activeCriticalRisks > 0 ? ` ${activeCriticalRisks} critical risk${activeCriticalRisks === 1 ? "" : "s"} require executive mitigation before execution.` : ""}`
      : `No executable option is currently available for ${input.decisionTitle}. Additional decision alternatives and supporting evidence are required.`;

    return {
      priority,
      confidence,
      expectedImpact,
      recommendedOption,
      decisionScore,
      reasoningSummary,
    };
  }
}
