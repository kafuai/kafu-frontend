import { AIObservabilitySignal } from "./aiObservabilityTypes";

export interface AITokenUsageMetrics {
  totalTokenSignals: number;
  totalTokens: number;
  averageTokensPerSignal: number;
  maximumTokens: number;
}

export function calculateAITokenUsageMetrics(
  signals: AIObservabilitySignal[],
): AITokenUsageMetrics {
  const tokenValues = signals
    .filter((signal) => signal.type === "token_usage")
    .map((signal) => signal.value)
    .filter((value): value is number => value !== undefined);

  if (tokenValues.length === 0) {
    return {
      totalTokenSignals: 0,
      totalTokens: 0,
      averageTokensPerSignal: 0,
      maximumTokens: 0,
    };
  }

  const totalTokens = tokenValues.reduce((total, value) => total + value, 0);

  return {
    totalTokenSignals: tokenValues.length,
    totalTokens,
    averageTokensPerSignal: totalTokens / tokenValues.length,
    maximumTokens: Math.max(...tokenValues),
  };
}