export interface AIGovernanceViolation {
  id: string;
  policyId: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  detectedAt: string;
  resolved: boolean;
}

export function getOpenGovernanceViolations(
  violations: AIGovernanceViolation[],
): AIGovernanceViolation[] {
  return violations.filter((violation) => !violation.resolved);
}
