import { AIAutonomousIntelligenceSignal } from "./aiAutonomousIntelligenceSignal";
import {
  AIAutonomousIntelligenceConfidenceLevel,
  AIAutonomousIntelligenceInsightCategory,
  AIAutonomousIntelligenceInsightPriority,
  AIAutonomousIntelligenceRecommendation,
} from "./aiAutonomousIntelligenceTypes";

export interface AIAutonomousIntelligenceInsight {
  id: string;
  organizationId: string;
  category: AIAutonomousIntelligenceInsightCategory;
  priority: AIAutonomousIntelligenceInsightPriority;
  title: string;
  summary: string;
  confidence: AIAutonomousIntelligenceConfidenceLevel;
  signalIds: string[];
  recommendations: AIAutonomousIntelligenceRecommendation[];
  createdAt: Date;
}

export interface CreateAIAutonomousIntelligenceInsightInput {
  id: string;
  organizationId: string;
  category: AIAutonomousIntelligenceInsightCategory;
  priority: AIAutonomousIntelligenceInsightPriority;
  title: string;
  summary: string;
  confidence: AIAutonomousIntelligenceConfidenceLevel;
  signals: AIAutonomousIntelligenceSignal[];
  recommendations?: AIAutonomousIntelligenceRecommendation[];
  createdAt?: Date;
}

export function createAIAutonomousIntelligenceInsight(
  input: CreateAIAutonomousIntelligenceInsightInput,
): AIAutonomousIntelligenceInsight {
  return {
    id: input.id,
    organizationId: input.organizationId,
    category: input.category,
    priority: input.priority,
    title: input.title,
    summary: input.summary,
    confidence: input.confidence,
    signalIds: input.signals.map((signal) => signal.id),
    recommendations: input.recommendations ?? [],
    createdAt: input.createdAt ?? new Date(),
  };
}

export function hasActionableAIAutonomousIntelligenceRecommendation(
  insight: AIAutonomousIntelligenceInsight,
): boolean {
  return insight.recommendations.some(
    (recommendation) =>
      recommendation.actionability === "recommend" ||
      recommendation.actionability === "escalate" ||
      recommendation.actionability === "execute-ready",
  );
}