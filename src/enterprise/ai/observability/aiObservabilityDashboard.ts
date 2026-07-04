import { AICostMetrics, calculateAICostMetrics } from "./aiCostMetrics";
import { AIDriftObservabilitySummary, summarizeAIDriftObservability } from "./aiDriftObservability";
import { AIErrorObservabilitySummary, summarizeAIErrorObservability } from "./aiErrorObservability";
import { AILatencyMetrics, calculateAILatencyMetrics } from "./aiLatencyMetrics";
import { AIObservabilitySignal } from "./aiObservabilityTypes";
import { AIQualityObservabilitySummary, summarizeAIQualityObservability } from "./aiQualityObservability";
import { AITokenUsageMetrics, calculateAITokenUsageMetrics } from "./aiTokenUsageMetrics";

export interface AIObservabilityDashboard {
  generatedAt: Date;
  latency: AILatencyMetrics;
  tokens: AITokenUsageMetrics;
  cost: AICostMetrics;
  errors: AIErrorObservabilitySummary;
  quality: AIQualityObservabilitySummary;
  drift: AIDriftObservabilitySummary;
}

export function buildAIObservabilityDashboard(
  signals: AIObservabilitySignal[],
): AIObservabilityDashboard {
  return {
    generatedAt: new Date(),
    latency: calculateAILatencyMetrics(signals),
    tokens: calculateAITokenUsageMetrics(signals),
    cost: calculateAICostMetrics(signals),
    errors: summarizeAIErrorObservability(signals),
    quality: summarizeAIQualityObservability(signals),
    drift: summarizeAIDriftObservability(signals),
  };
}