export interface PerformanceRiskAssessment {
  area: string;
  level:
    | "low"
    | "medium"
    | "high"
    | "critical";
  factors: string[];
}

export function hasPerformanceRisk(
  assessment: PerformanceRiskAssessment
): boolean {
  return (
    assessment.level === "high" ||
    assessment.level === "critical"
  );
}
