export interface BenefitRiskAssessment {
  area: string;
  level:
    | "low"
    | "medium"
    | "high"
    | "critical";
  factors: string[];
}

export function hasBenefitRisk(
  assessment: BenefitRiskAssessment
): boolean {
  return (
    assessment.level === "high" ||
    assessment.level === "critical"
  );
}
