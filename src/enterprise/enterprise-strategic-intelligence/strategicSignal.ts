import { StrategicSignal } from "./strategicIntelligenceTypes";

export function createStrategicSignal(
  signal: StrategicSignal,
): StrategicSignal {
  return {
    ...signal,
    confidence: Math.max(0, Math.min(signal.confidence, 1)),
    impact: Math.max(0, Math.min(signal.impact, 1)),
  };
}