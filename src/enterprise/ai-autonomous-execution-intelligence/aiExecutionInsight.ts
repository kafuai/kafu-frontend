import {
  AIExecutionIntelligenceCategory,
  AIExecutionIntelligenceConfidence,
  AIExecutionIntelligenceMetadata,
  AIExecutionIntelligenceRecommendation,
  AIExecutionIntelligenceRiskIndicator,
  AIExecutionIntelligenceSeverity,
  AIExecutionIntelligenceTrend,
} from "./aiExecutionIntelligenceTypes";

export interface AIExecutionInsight {
  id: string;
  title: string;
  summary: string;
  category: AIExecutionIntelligenceCategory;
  severity: AIExecutionIntelligenceSeverity;
  confidence: AIExecutionIntelligenceConfidence;
  confidenceScore: number;
  trend: AIExecutionIntelligenceTrend;
  riskIndicators: AIExecutionIntelligenceRiskIndicator[];
  recommendations: AIExecutionIntelligenceRecommendation[];
  metadata: AIExecutionIntelligenceMetadata;
}

export interface CreateAIExecutionInsightInput {
  id: string;
  title: string;
  summary: string;
  category: AIExecutionIntelligenceCategory;
  severity: AIExecutionIntelligenceSeverity;
  confidenceScore: number;
  trend?: AIExecutionIntelligenceTrend;
  riskIndicators?: AIExecutionIntelligenceRiskIndicator[];
  recommendations?: AIExecutionIntelligenceRecommendation[];
  metadata: AIExecutionIntelligenceMetadata;
}

export function resolveAIExecutionIntelligenceConfidence(
  confidenceScore: number,
): AIExecutionIntelligenceConfidence {
  if (confidenceScore >= 0.75) {
    return "high";
  }

  if (confidenceScore >= 0.45) {
    return "medium";
  }

  return "low";
}

export function createAIExecutionInsight(
  input: CreateAIExecutionInsightInput,
): AIExecutionInsight {
  const normalizedConfidenceScore = Math.min(Math.max(input.confidenceScore, 0), 1);

  return {
    id: input.id,
    title: input.title,
    summary: input.summary,
    category: input.category,
    severity: input.severity,
    confidence: resolveAIExecutionIntelligenceConfidence(normalizedConfidenceScore),
    confidenceScore: normalizedConfidenceScore,
    trend: input.trend ?? "unknown",
    riskIndicators: input.riskIndicators ?? [],
    recommendations: input.recommendations ?? [],
    metadata: input.metadata,
  };
}