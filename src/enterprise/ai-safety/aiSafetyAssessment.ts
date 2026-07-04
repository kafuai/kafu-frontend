import {
  AISafetyDecision,
  AISafetyRiskLevel,
  AISafetySignal,
  AISafetyStatus,
} from "./aiSafetyTypes";

export interface AISafetyAssessmentInput {
  organizationId: string;
  requestId: string;
  modelId: string;
  inputText?: string;
  outputText?: string;
  signals: AISafetySignal[];
}

function rankRiskLevel(level: AISafetyRiskLevel): number {
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

export function getHighestAISafetyRiskLevel(
  signals: AISafetySignal[],
): AISafetyRiskLevel {
  if (signals.length === 0) {
    return AISafetyRiskLevel.LOW;
  }

  return signals.reduce((highest, signal) =>
    rankRiskLevel(signal.riskLevel) > rankRiskLevel(highest)
      ? signal.riskLevel
      : highest,
  signals[0].riskLevel);
}

export function assessAISafety(
  input: AISafetyAssessmentInput,
): AISafetyDecision {
  const highestRiskLevel = getHighestAISafetyRiskLevel(input.signals);

  if (highestRiskLevel === AISafetyRiskLevel.CRITICAL) {
    return {
      status: AISafetyStatus.BLOCKED,
      riskLevel: highestRiskLevel,
      allowExecution: false,
      requiresHumanReview: true,
      signals: input.signals,
      reason: "Critical AI safety risk detected. Execution blocked.",
      evaluatedAt: new Date(),
    };
  }

  if (highestRiskLevel === AISafetyRiskLevel.HIGH) {
    return {
      status: AISafetyStatus.NEEDS_REVIEW,
      riskLevel: highestRiskLevel,
      allowExecution: false,
      requiresHumanReview: true,
      signals: input.signals,
      reason: "High AI safety risk detected. Human review required.",
      evaluatedAt: new Date(),
    };
  }

  if (highestRiskLevel === AISafetyRiskLevel.MEDIUM) {
    return {
      status: AISafetyStatus.NEEDS_REVIEW,
      riskLevel: highestRiskLevel,
      allowExecution: true,
      requiresHumanReview: true,
      signals: input.signals,
      reason: "Medium AI safety risk detected. Execution allowed with review.",
      evaluatedAt: new Date(),
    };
  }

  return {
    status: AISafetyStatus.SAFE,
    riskLevel: AISafetyRiskLevel.LOW,
    allowExecution: true,
    requiresHumanReview: false,
    signals: input.signals,
    reason: "No material AI safety risk detected.",
    evaluatedAt: new Date(),
  };
}