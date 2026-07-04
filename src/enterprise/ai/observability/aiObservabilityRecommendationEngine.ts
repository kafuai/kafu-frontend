import {
  createAIObservabilityRecommendation,
  AIObservabilityRecommendation,
} from "./aiObservabilityRecommendation";
import { AIObservabilitySignal } from "./aiObservabilityTypes";

export function generateAIObservabilityRecommendations(
  signals: AIObservabilitySignal[],
): AIObservabilityRecommendation[] {
  const recommendations: AIObservabilityRecommendation[] = [];

  for (const signal of signals) {
    if (signal.type === "latency" && signal.value !== undefined && signal.value >= 3000) {
      recommendations.push(
        createAIObservabilityRecommendation({
          id: `recommendation:${signal.id}`,
          organizationId: signal.metadata.organizationId,
          environment: signal.metadata.environment,
          serviceName: signal.metadata.serviceName,
          type: signal.type,
          severity: signal.severity,
          title: "High AI latency detected",
          recommendation:
            "Review model routing, prompt size, provider response time, and caching strategy.",
          reason: signal.message,
        }),
      );
    }

    if (signal.type === "cost" && signal.value !== undefined && signal.value > 1) {
      recommendations.push(
        createAIObservabilityRecommendation({
          id: `recommendation:${signal.id}`,
          organizationId: signal.metadata.organizationId,
          environment: signal.metadata.environment,
          serviceName: signal.metadata.serviceName,
          type: signal.type,
          severity: signal.severity,
          title: "High AI cost detected",
          recommendation:
            "Review token usage, model selection, batching, and request optimization strategy.",
          reason: signal.message,
        }),
      );
    }

    if (signal.type === "quality" && signal.value !== undefined && signal.value < 0.7) {
      recommendations.push(
        createAIObservabilityRecommendation({
          id: `recommendation:${signal.id}`,
          organizationId: signal.metadata.organizationId,
          environment: signal.metadata.environment,
          serviceName: signal.metadata.serviceName,
          type: signal.type,
          severity: signal.severity,
          title: "AI quality degradation detected",
          recommendation:
            "Review prompt templates, evaluation criteria, retrieval context, and model configuration.",
          reason: signal.message,
        }),
      );
    }

    if (signal.type === "drift" && signal.value !== undefined && signal.value >= 0.3) {
      recommendations.push(
        createAIObservabilityRecommendation({
          id: `recommendation:${signal.id}`,
          organizationId: signal.metadata.organizationId,
          environment: signal.metadata.environment,
          serviceName: signal.metadata.serviceName,
          type: signal.type,
          severity: signal.severity,
          title: "AI drift signal detected",
          recommendation:
            "Run validation checks, compare recent outputs with baseline behavior, and review input distribution changes.",
          reason: signal.message,
        }),
      );
    }

    if (signal.type === "error") {
      recommendations.push(
        createAIObservabilityRecommendation({
          id: `recommendation:${signal.id}`,
          organizationId: signal.metadata.organizationId,
          environment: signal.metadata.environment,
          serviceName: signal.metadata.serviceName,
          type: signal.type,
          severity: signal.severity,
          title: "AI error detected",
          recommendation:
            "Inspect provider errors, retry behavior, fallback routing, and request validation logs.",
          reason: signal.message,
        }),
      );
    }
  }

  return recommendations;
}