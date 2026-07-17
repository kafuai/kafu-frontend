import {
  ExecutiveOperationalReadinessInput,
  ExecutiveOperationalReadinessResult,
} from "./executiveDemoOperationalReadinessTypes";

export function buildExecutiveOperationalReadiness(
  input: ExecutiveOperationalReadinessInput,
): ExecutiveOperationalReadinessResult {
  const overallScore = Math.round(
    (
      input.readinessScore +
      input.governanceScore +
      input.executionScore +
      input.intelligenceScore
    ) / 4,
  );

  const readinessLevel =
    overallScore >= 90
      ? "excellent"
      : overallScore >= 75
        ? "high"
        : overallScore >= 60
          ? "moderate"
          : overallScore >= 40
            ? "low"
            : "critical";

  const strengths: string[] = [];
  const risks: string[] = [];
  const recommendations: string[] = [];

  if (input.governanceScore >= 80) {
    strengths.push("Strong governance maturity.");
  } else {
    risks.push("Governance capability requires improvement.");
    recommendations.push("Strengthen governance processes and accountability.");
  }

  if (input.executionScore >= 80) {
    strengths.push("Execution capability is well established.");
  } else {
    risks.push("Execution consistency is below target.");
    recommendations.push("Improve execution monitoring and delivery discipline.");
  }

  if (input.intelligenceScore >= 80) {
    strengths.push("Decision intelligence is providing good support.");
  } else {
    risks.push("Decision intelligence coverage is limited.");
    recommendations.push("Expand AI-driven insights and executive reporting.");
  }

  return {
    overallScore,
    readinessLevel,
    strengths,
    risks,
    recommendations,
  };
}