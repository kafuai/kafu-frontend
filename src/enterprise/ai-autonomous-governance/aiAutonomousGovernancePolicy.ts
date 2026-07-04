import {
  AIAutonomousGovernanceControlType,
  AIAutonomousGovernancePolicySeverity,
  AIAutonomousGovernanceRiskLevel,
} from "./aiAutonomousGovernanceTypes";

export interface AIAutonomousGovernancePolicy {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  severity: AIAutonomousGovernancePolicySeverity;
  appliesToCapabilities: string[];
  minimumRiskLevel: AIAutonomousGovernanceRiskLevel;
  requiredControls: AIAutonomousGovernanceControlType[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function isAIAutonomousGovernancePolicyApplicable(
  policy: AIAutonomousGovernancePolicy,
  capabilityId: string,
): boolean {
  if (!policy.isActive) {
    return false;
  }

  return (
    policy.appliesToCapabilities.includes("*") ||
    policy.appliesToCapabilities.includes(capabilityId)
  );
}