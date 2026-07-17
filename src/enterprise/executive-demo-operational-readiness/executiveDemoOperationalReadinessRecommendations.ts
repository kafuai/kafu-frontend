import { ExecutiveOperationalReadinessResult } from "./executiveDemoOperationalReadinessTypes";

export interface ExecutiveOperationalReadinessRecommendation {
  priority: "high" | "medium" | "low";
  title: string;
  action: string;
}

export function buildExecutiveOperationalReadinessRecommendations(
  result: ExecutiveOperationalReadinessResult,
): ExecutiveOperationalReadinessRecommendation[] {
  if (result.recommendations.length === 0) {
    return [
      {
        priority: "low",
        title: "Maintain operational readiness",
        action: "Continue monitoring readiness indicators and demo execution quality.",
      },
    ];
  }

  return result.recommendations.map((recommendation, index) => ({
    priority:
      result.overallScore < 40
        ? "high"
        : result.overallScore < 75
          ? "medium"
          : "low",
    title: `Readiness action ${index + 1}`,
    action: recommendation,
  }));
}
