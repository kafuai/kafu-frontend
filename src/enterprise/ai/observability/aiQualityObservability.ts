import { AIObservabilitySignal } from "./aiObservabilityTypes";

export interface AIQualityObservabilitySummary {
  totalQualitySignals: number;
  averageQualityScore: number;
  lowQualitySignals: number;
  minimumQualityScore: number;
}

export function summarizeAIQualityObservability(
  signals: AIObservabilitySignal[],
  lowQualityThreshold = 0.7,
): AIQualityObservabilitySummary {
  const qualityValues = signals
    .filter((signal) => signal.type === "quality")
    .map((signal) => signal.value)
    .filter((value): value is number => value !== undefined);

  if (qualityValues.length === 0) {
    return {
      totalQualitySignals: 0,
      averageQualityScore: 0,
      lowQualitySignals: 0,
      minimumQualityScore: 0,
    };
  }

  const totalQuality = qualityValues.reduce((total, value) => total + value, 0);

  return {
    totalQualitySignals: qualityValues.length,
    averageQualityScore: totalQuality / qualityValues.length,
    lowQualitySignals: qualityValues.filter((value) => value < lowQualityThreshold).length,
    minimumQualityScore: Math.min(...qualityValues),
  };
}