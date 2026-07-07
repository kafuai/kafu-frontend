export interface AIGovernanceRiskAssessmentLike {
  category: string;
  likelihood: number;
  impact: number;
}

export interface AIGovernanceRiskMatrixEntry {
  category: string;
  likelihood: number;
  impact: number;
  score: number;
  severity: "low" | "medium" | "high" | "critical";
}

export function buildAIGovernanceRiskMatrix(
  assessments: AIGovernanceRiskAssessmentLike[],
): AIGovernanceRiskMatrixEntry[] {
  return assessments.map((assessment) => {
    const likelihood = Math.max(0, Math.min(assessment.likelihood, 5));
    const impact = Math.max(0, Math.min(assessment.impact, 5));
    const score = likelihood * impact;

    return {
      category: assessment.category,
      likelihood,
      impact,
      score,
      severity:
        score >= 20 ? "critical" :
        score >= 12 ? "high" :
        score >= 6 ? "medium" :
        "low",
    };
  });
}
