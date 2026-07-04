import { AIAutonomousIntelligenceSignal } from "./aiAutonomousIntelligenceSignal";

export interface AIAutonomousIntelligenceScore {
  overall: number;
  signalStrength: number;
  evidenceStrength: number;
}

export function calculateAIAutonomousIntelligenceScore(
  signals: AIAutonomousIntelligenceSignal[],
): AIAutonomousIntelligenceScore {
  if (signals.length === 0) {
    return {
      overall: 0,
      signalStrength: 0,
      evidenceStrength: 0,
    };
  }

  const evidenceCount = signals.reduce(
    (total, signal) => total + signal.evidence.length,
    0,
  );

  const signalStrength = Math.min(
    100,
    signals.length * 10,
  );

  const evidenceStrength = Math.min(
    100,
    evidenceCount * 5,
  );

  return {
    overall: Math.round(
      (signalStrength + evidenceStrength) / 2,
    ),
    signalStrength,
    evidenceStrength,
  };
}