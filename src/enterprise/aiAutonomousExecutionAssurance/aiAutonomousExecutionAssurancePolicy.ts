import { AIAutonomousExecutionAssuranceInput } from "./aiAutonomousExecutionAssuranceTypes";

export interface AIAutonomousExecutionAssurancePolicy {
  minimumVerificationScore: number;
  maximumRiskScore: number;
  minimumOperationalReadiness: number;
  minimumAuditCoverage: number;
}

export const defaultExecutionAssurancePolicy: AIAutonomousExecutionAssurancePolicy =
  {
    minimumVerificationScore: 0.9,
    maximumRiskScore: 0.25,
    minimumOperationalReadiness: 0.9,
    minimumAuditCoverage: 0.9,
  };

export function satisfiesExecutionAssurancePolicy(
  input: AIAutonomousExecutionAssuranceInput,
  policy: AIAutonomousExecutionAssurancePolicy =
    defaultExecutionAssurancePolicy,
): boolean {
  return (
    input.verificationPassed &&
    input.verificationScore >= policy.minimumVerificationScore &&
    input.riskScore <= policy.maximumRiskScore &&
    input.operationalReadinessScore >= policy.minimumOperationalReadiness &&
    input.auditCoverageScore >= policy.minimumAuditCoverage
  );
}