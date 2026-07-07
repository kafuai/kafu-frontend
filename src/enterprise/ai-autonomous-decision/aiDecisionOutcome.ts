import {
  AIDecisionOutcome,
  AIDecisionRiskLevel,
} from "./aiAutonomousDecisionTypes";
import { AIDecisionPolicy } from "./aiDecisionPolicy";
import { AIDecisionOption } from "./aiDecisionOption";
import { AIDecisionConfidenceAssessment } from "./aiDecisionConfidence";
import { AIDecisionRiskAssessment } from "./aiDecisionRiskAssessment";

export interface AIDecisionOutcomeResolution {
  optionId?: string;
  outcome: AIDecisionOutcome;
  reason: string;
  requiresHumanApproval: boolean;
  resolvedAt: Date;
}

function isRiskAllowed(
  riskLevel: AIDecisionRiskLevel,
  allowedRiskLevels: AIDecisionRiskLevel[] = ["low", "medium", "high"],
): boolean {
  return allowedRiskLevels.includes(riskLevel);
}

export function resolveAIDecisionOutcome(
  selectedOption: AIDecisionOption | undefined,
  policy: AIDecisionPolicy,
  confidence?: AIDecisionConfidenceAssessment,
  risk?: AIDecisionRiskAssessment,
): AIDecisionOutcomeResolution {
  if (!selectedOption) {
    return {
      outcome: "request_more_data",
      reason: "No selected option is available for outcome resolution.",
      requiresHumanApproval: true,
      resolvedAt: new Date(),
    };
  }

  if (!confidence || !risk) {
    return {
      optionId: selectedOption.id,
      outcome: "request_more_data",
      reason: "Decision is missing confidence or risk assessment.",
      requiresHumanApproval: true,
      resolvedAt: new Date(),
    };
  }

  if (risk.blockers.length > 0) {
    return {
      optionId: selectedOption.id,
      outcome: "escalate",
      reason: "Decision has blockers requiring escalation.",
      requiresHumanApproval: true,
      resolvedAt: new Date(),
    };
  }

  if (!isRiskAllowed(risk.riskLevel, policy.allowedRiskLevels)) {
    return {
      optionId: selectedOption.id,
      outcome: "escalate",
      reason: `Risk level "${risk.riskLevel}" is not allowed by policy.`,
      requiresHumanApproval: true,
      resolvedAt: new Date(),
    };
  }

  if (confidence.confidenceScore < (policy.minimumConfidence ?? 0.6)) {
    return {
      optionId: selectedOption.id,
      outcome: "deferred",
      reason: "Decision confidence is below policy threshold.",
      requiresHumanApproval: true,
      resolvedAt: new Date(),
    };
  }

  const requiresHumanApproval =
    (policy.requireHumanApprovalForCritical ?? true) &&
    selectedOption.priority === "critical";

  return {
    optionId: selectedOption.id,
    outcome: requiresHumanApproval ? "escalate" : "approved",
    reason: requiresHumanApproval
      ? "Policy requires human approval before autonomous decision execution."
      : "Decision passed policy gates and is approved.",
    requiresHumanApproval,
    resolvedAt: new Date(),
  };
}