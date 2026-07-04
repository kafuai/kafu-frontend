export type EnterpriseExecutionPolicyRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export function classifyEnterpriseExecutionPolicyRisk(
  riskScore: number
): EnterpriseExecutionPolicyRiskLevel {
  if (riskScore >= 90) {
    return "critical";
  }

  if (riskScore >= 70) {
    return "high";
  }

  if (riskScore >= 40) {
    return "medium";
  }

  return "low";
}