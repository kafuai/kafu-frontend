export interface CompensationRiskAssessment {
  area: string;
  level:
    | "low"
    | "medium"
    | "high"
    | "critical";
  factors: string[];
}

export function hasCompensationRisk(
  assessment: CompensationRiskAssessment
): boolean {
  return (
    assessment.level === "high" ||
    assessment.level === "critical"
  );
}
