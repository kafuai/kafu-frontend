import { AIAutonomousDecisionRiskLevel } from "./aiAutonomousDecisionTypes";
import { AIDecisionOption } from "./aiDecisionOption";

export interface AIDecisionPolicy {
  id: string;
  name: string;
  description?: string;

  minimumScore?: number;
  minimumConfidence?: number;

  allowedRiskLevels?: AIAutonomousDecisionRiskLevel[];
  maxAllowedRiskLevel?: AIAutonomousDecisionRiskLevel;

  requireHumanApprovalForCritical?: boolean;

  createdAt?: string;
  createdBy?: string;
}

export function createAIDecisionPolicy(
  policy: Omit<AIDecisionPolicy, "createdAt">,
): AIDecisionPolicy {
  return {
    id: policy.id,
    name: policy.name,
    description: policy.description,

    minimumScore: policy.minimumScore ?? 70,
    minimumConfidence: policy.minimumConfidence ?? 0.6,

    allowedRiskLevels:
      policy.allowedRiskLevels ?? ["low", "medium", "high"],

    maxAllowedRiskLevel:
      policy.maxAllowedRiskLevel ?? "high",

    requireHumanApprovalForCritical:
      policy.requireHumanApprovalForCritical ?? true,

    createdBy: policy.createdBy,
    createdAt: new Date().toISOString(),
  };
}

export function isAIDecisionOptionAllowedByPolicy(
  option: AIDecisionOption,
  policy: AIDecisionPolicy,
): boolean {
  const minimumConfidence = policy.minimumConfidence ?? 0.6;

  const allowedRiskLevels =
    policy.allowedRiskLevels ?? ["low", "medium", "high"];

  if (option.confidence < minimumConfidence) {
    return false;
  }

  if (
    (policy.requireHumanApprovalForCritical ?? true) &&
    option.priority === "critical"
  ) {
    return false;
  }

  return allowedRiskLevels.includes(option.riskLevel);
}