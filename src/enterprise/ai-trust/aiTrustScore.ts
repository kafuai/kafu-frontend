import { AITrustLevel } from "./aiTrustTypes";
import { AITrustSignal, calculateWeightedAITrustSignal } from "./aiTrustSignal";

export interface AITrustScore {
  score: number;
  level: AITrustLevel;
  totalWeight: number;
  calculatedAt: Date;
}

export function resolveAITrustLevel(score: number): AITrustLevel {
  if (score >= 90) return "very_high";
  if (score >= 75) return "high";
  if (score >= 50) return "medium";
  if (score >= 25) return "low";
  return "very_low";
}

export function calculateAITrustScore(signals: AITrustSignal[]): AITrustScore {
  const totalWeight = signals.reduce((sum, signal) => sum + Math.max(0, signal.weight), 0);

  if (totalWeight === 0) {
    return {
      score: 0,
      level: "very_low",
      totalWeight: 0,
      calculatedAt: new Date(),
    };
  }

  const weightedScore =
    signals.reduce((sum, signal) => sum + calculateWeightedAITrustSignal(signal), 0) /
    totalWeight;

  const score = Math.round(weightedScore * 100) / 100;

  return {
    score,
    level: resolveAITrustLevel(score),
    totalWeight,
    calculatedAt: new Date(),
  };
}