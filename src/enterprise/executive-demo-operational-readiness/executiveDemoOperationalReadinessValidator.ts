import { ExecutiveOperationalReadinessInput } from "./executiveDemoOperationalReadinessTypes";

export function validateExecutiveOperationalReadiness(
  input: ExecutiveOperationalReadinessInput,
): void {
  if (!input.organizationId.trim()) {
    throw new Error("organizationId is required.");
  }

  const scores = [
    input.readinessScore,
    input.governanceScore,
    input.executionScore,
    input.intelligenceScore,
  ];

  for (const score of scores) {
    if (!Number.isFinite(score) || score < 0 || score > 100) {
      throw new Error("Scores must be finite numbers between 0 and 100.");
    }
  }
}