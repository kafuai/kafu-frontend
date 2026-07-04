import { AIAutonomousGovernanceRuntimeResult } from "./aiAutonomousGovernanceRuntime";

export interface AIAutonomousGovernanceReport {
  executionId: string;
  decision: string;
  allowed: boolean;
  riskLevel: string;
  riskScore: number;
  appliedPolicyCount: number;
  requiredControlCount: number;
  unsatisfiedControlCount: number;
  reasons: string[];
  generatedAt: Date;
}

export function createAIAutonomousGovernanceReport(
  result: AIAutonomousGovernanceRuntimeResult,
): AIAutonomousGovernanceReport {
  const unsatisfiedControlCount =
    result.enforcement.controlStatuses.filter((status) => !status.satisfied)
      .length;

  return {
    executionId: result.decision.executionId,
    decision: result.decision.decision,
    allowed: result.enforcement.allowed,
    riskLevel: result.decision.riskAssessment.riskLevel,
    riskScore: result.decision.riskAssessment.score,
    appliedPolicyCount: result.decision.appliedPolicies.length,
    requiredControlCount: result.decision.requiredControls.length,
    unsatisfiedControlCount,
    reasons: result.audit.reasons,
    generatedAt: new Date(),
  };
}