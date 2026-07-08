export interface WorkforceRiskAssessment {
  area: string;
  level:
    | "low"
    | "medium"
    | "high"
    | "critical";
  factors: string[];
}

export function hasWorkforceRisk(
  assessment: WorkforceRiskAssessment
): boolean {
  return (
    assessment.level === "high" ||
    assessment.level === "critical"
  );
}
