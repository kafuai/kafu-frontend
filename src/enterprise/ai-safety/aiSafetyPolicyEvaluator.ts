import { AISafetyPolicy } from "./aiSafetyPolicy";
import {
  AISafetyDecision,
  AISafetyRiskLevel,
  AISafetyStatus,
} from "./aiSafetyTypes";

function riskRank(level: AISafetyRiskLevel): number {
  switch (level) {
    case AISafetyRiskLevel.LOW:
      return 1;
    case AISafetyRiskLevel.MEDIUM:
      return 2;
    case AISafetyRiskLevel.HIGH:
      return 3;
    case AISafetyRiskLevel.CRITICAL:
      return 4;
    default:
      return 0;
  }
}

export function applyAISafetyPolicy(
  decision: AISafetyDecision,
  policy: AISafetyPolicy,
): AISafetyDecision {
  if (!policy.enabled) {
    return decision;
  }

  const violatingSignals = decision.signals.filter((signal) => {
    const rule = policy.rules.find((item) => item.domain === signal.domain);

    if (!rule) {
      return false;
    }

    return (
      riskRank(signal.riskLevel) > riskRank(rule.maxAllowedRiskLevel) ||
      (rule.blockOnCritical &&
        signal.riskLevel === AISafetyRiskLevel.CRITICAL)
    );
  });

  if (violatingSignals.some((signal) => signal.riskLevel === AISafetyRiskLevel.CRITICAL)) {
    return {
      ...decision,
      status: AISafetyStatus.BLOCKED,
      allowExecution: false,
      requiresHumanReview: true,
      reason: "AI safety policy violation detected. Critical risk blocked.",
    };
  }

  if (violatingSignals.length > 0) {
    return {
      ...decision,
      status: AISafetyStatus.NEEDS_REVIEW,
      allowExecution: false,
      requiresHumanReview: true,
      reason: "AI safety policy violation detected. Human review required.",
    };
  }

  return decision;
}