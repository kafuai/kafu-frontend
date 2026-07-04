import {
  AIObservabilitySeverity,
  AIObservabilitySignalType,
} from "./aiObservabilityTypes";

export type AIObservabilityRecommendationPriority =
  | "low"
  | "medium"
  | "high"
  | "urgent";

export interface AIObservabilityRecommendation {
  id: string;
  organizationId: string;
  environment: string;
  serviceName: string;
  type: AIObservabilitySignalType;
  priority: AIObservabilityRecommendationPriority;
  title: string;
  recommendation: string;
  reason: string;
  createdAt: Date;
}

export interface CreateAIObservabilityRecommendationInput {
  id: string;
  organizationId: string;
  environment: string;
  serviceName: string;
  type: AIObservabilitySignalType;
  severity: AIObservabilitySeverity;
  title: string;
  recommendation: string;
  reason: string;
  createdAt?: Date;
}

export function createAIObservabilityRecommendation(
  input: CreateAIObservabilityRecommendationInput,
): AIObservabilityRecommendation {
  const priority: AIObservabilityRecommendationPriority =
    input.severity === "critical"
      ? "urgent"
      : input.severity === "warning"
        ? "high"
        : "medium";

  return {
    id: input.id,
    organizationId: input.organizationId,
    environment: input.environment,
    serviceName: input.serviceName,
    type: input.type,
    priority,
    title: input.title,
    recommendation: input.recommendation,
    reason: input.reason,
    createdAt: input.createdAt ?? new Date(),
  };
}