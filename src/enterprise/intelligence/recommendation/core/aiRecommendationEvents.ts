import {
  AIRecommendationContext,
  AIRecommendationSignal,
} from "../types/aiRecommendationTypes";
import { AIRecommendationResult } from "../models/aiRecommendationModel";

export type AIRecommendationEventType =
  | "recommendation_requested"
  | "recommendation_policy_failed"
  | "recommendation_signal_selected"
  | "recommendation_generated";

export interface AIRecommendationEvent {
  id: string;
  organizationId: string;
  type: AIRecommendationEventType;
  message: string;
  createdAt: Date;
  metadata: Record<string, unknown>;
}

export function createAIRecommendationRequestedEvent(
  context: AIRecommendationContext,
): AIRecommendationEvent {
  return {
    id: `${context.organizationId}-recommendation-requested-${Date.now()}`,
    organizationId: context.organizationId,
    type: "recommendation_requested",
    message: "AI recommendation generation was requested.",
    createdAt: new Date(),
    metadata: {
      objective: context.objective,
      domain: context.domain,
      requestedBy: context.requestedBy,
      signalCount: context.signals.length,
    },
  };
}

export function createAIRecommendationPolicyFailedEvent(
  context: AIRecommendationContext,
  reasons: string[],
): AIRecommendationEvent {
  return {
    id: `${context.organizationId}-recommendation-policy-failed-${Date.now()}`,
    organizationId: context.organizationId,
    type: "recommendation_policy_failed",
    message: "AI recommendation policy validation failed.",
    createdAt: new Date(),
    metadata: {
      reasons,
      objective: context.objective,
    },
  };
}

export function createAIRecommendationSignalSelectedEvent(
  organizationId: string,
  signal: AIRecommendationSignal,
): AIRecommendationEvent {
  return {
    id: `${organizationId}-recommendation-signal-selected-${signal.id}`,
    organizationId,
    type: "recommendation_signal_selected",
    message: "A signal was selected for recommendation generation.",
    createdAt: new Date(),
    metadata: {
      signalId: signal.id,
      signalType: signal.type,
      domain: signal.domain,
      priority: signal.priority,
      confidence: signal.confidence,
    },
  };
}

export function createAIRecommendationGeneratedEvent(
  result: AIRecommendationResult,
): AIRecommendationEvent {
  return {
    id: `${result.organizationId}-recommendation-generated-${Date.now()}`,
    organizationId: result.organizationId,
    type: "recommendation_generated",
    message: "AI recommendations were generated successfully.",
    createdAt: new Date(),
    metadata: {
      resultId: result.id,
      objective: result.objective,
      recommendationCount: result.recommendations.length,
    },
  };
}