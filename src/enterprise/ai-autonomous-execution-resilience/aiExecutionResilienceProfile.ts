import {
  AIExecutionResilienceLevel,
  AIExecutionResilienceRisk,
  AIExecutionResilienceScore,
  AIExecutionResilienceSignal,
} from "./aiExecutionResilienceTypes";

export interface AIExecutionResilienceProfile {
  executionId: string;
  level: AIExecutionResilienceLevel;
  risk: AIExecutionResilienceRisk;
  score: AIExecutionResilienceScore;
  signals: AIExecutionResilienceSignal[];
  createdAt: Date;
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function calculateAIExecutionResilienceOverallScore(
  score: Omit<AIExecutionResilienceScore, "overall">,
): number {
  const overall =
    score.stability * 0.25 +
    score.recoveryReadiness * 0.25 +
    score.fallbackReadiness * 0.2 +
    score.monitoringCoverage * 0.15 +
    score.retrySafety * 0.15;

  return clampScore(overall);
}

export function resolveAIExecutionResilienceLevel(
  overall: number,
): AIExecutionResilienceLevel {
  if (overall >= 0.9) return "excellent";
  if (overall >= 0.75) return "strong";
  if (overall >= 0.55) return "stable";
  if (overall >= 0.35) return "fragile";
  return "critical";
}

export function resolveAIExecutionResilienceRisk(
  level: AIExecutionResilienceLevel,
): AIExecutionResilienceRisk {
  switch (level) {
    case "excellent":
      return "none";
    case "strong":
      return "low";
    case "stable":
      return "medium";
    case "fragile":
      return "high";
    case "critical":
      return "severe";
  }
}

export function createAIExecutionResilienceProfile(input: {
  executionId: string;
  stability: number;
  recoveryReadiness: number;
  fallbackReadiness: number;
  monitoringCoverage: number;
  retrySafety: number;
  signals?: AIExecutionResilienceSignal[];
  createdAt?: Date;
}): AIExecutionResilienceProfile {
  const partialScore = {
    stability: clampScore(input.stability),
    recoveryReadiness: clampScore(input.recoveryReadiness),
    fallbackReadiness: clampScore(input.fallbackReadiness),
    monitoringCoverage: clampScore(input.monitoringCoverage),
    retrySafety: clampScore(input.retrySafety),
  };

  const overall = calculateAIExecutionResilienceOverallScore(partialScore);
  const level = resolveAIExecutionResilienceLevel(overall);

  return {
    executionId: input.executionId,
    level,
    risk: resolveAIExecutionResilienceRisk(level),
    score: {
      ...partialScore,
      overall,
    },
    signals: input.signals ?? [],
    createdAt: input.createdAt ?? new Date(),
  };
}