import { AIExecutionInsight } from "./aiExecutionInsight";
import {
  AIExecutionIntelligenceConfidence,
  AIExecutionIntelligenceMetadata,
  AIExecutionIntelligenceTrend,
} from "./aiExecutionIntelligenceTypes";

export interface AIExecutionIntelligenceProfile {
  id: string;
  executionId: string;
  overallScore: number;
  confidence: AIExecutionIntelligenceConfidence;
  trend: AIExecutionIntelligenceTrend;
  insights: AIExecutionInsight[];
  strengths: string[];
  weaknesses: string[];
  metadata: AIExecutionIntelligenceMetadata;
}

export interface CreateAIExecutionIntelligenceProfileInput {
  id: string;
  executionId: string;
  overallScore: number;
  trend?: AIExecutionIntelligenceTrend;
  insights?: AIExecutionInsight[];
  strengths?: string[];
  weaknesses?: string[];
  metadata: AIExecutionIntelligenceMetadata;
}

export function resolveAIExecutionIntelligenceProfileConfidence(
  score: number,
): AIExecutionIntelligenceConfidence {
  if (score >= 0.8) {
    return "high";
  }

  if (score >= 0.5) {
    return "medium";
  }

  return "low";
}

export function createAIExecutionIntelligenceProfile(
  input: CreateAIExecutionIntelligenceProfileInput,
): AIExecutionIntelligenceProfile {
  const normalizedScore = Math.min(Math.max(input.overallScore, 0), 1);

  return {
    id: input.id,
    executionId: input.executionId,
    overallScore: normalizedScore,
    confidence: resolveAIExecutionIntelligenceProfileConfidence(normalizedScore),
    trend: input.trend ?? "unknown",
    insights: input.insights ?? [],
    strengths: input.strengths ?? [],
    weaknesses: input.weaknesses ?? [],
    metadata: input.metadata,
  };
}