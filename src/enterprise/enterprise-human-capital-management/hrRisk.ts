export interface HRRiskAssessment {
  area: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  factors: string[];
}

export function hasHRRisk(
  assessment: HRRiskAssessment
): boolean {
  return (
    assessment.riskLevel === "high" ||
    assessment.riskLevel === "critical"
  );
}
