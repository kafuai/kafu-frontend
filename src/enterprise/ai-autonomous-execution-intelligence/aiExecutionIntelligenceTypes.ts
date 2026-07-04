export type AIExecutionIntelligenceSeverity = "low" | "medium" | "high" | "critical";

export type AIExecutionIntelligenceCategory =
  | "performance"
  | "reliability"
  | "adaptation"
  | "resilience"
  | "risk"
  | "quality"
  | "governance";

export type AIExecutionIntelligenceConfidence = "low" | "medium" | "high";

export type AIExecutionIntelligenceTrend =
  | "improving"
  | "stable"
  | "degrading"
  | "volatile"
  | "unknown";

export interface AIExecutionIntelligenceMetadata {
  sourceLayer: string;
  sourceMilestone?: string;
  generatedBy: string;
  generatedAt: Date;
  correlationId?: string;
}

export interface AIExecutionIntelligenceScoreBand {
  label: AIExecutionIntelligenceConfidence;
  minimumScore: number;
  maximumScore: number;
}

export interface AIExecutionIntelligenceRiskIndicator {
  id: string;
  category: AIExecutionIntelligenceCategory;
  severity: AIExecutionIntelligenceSeverity;
  description: string;
  confidence: number;
  detectedAt: Date;
}

export interface AIExecutionIntelligenceRecommendation {
  id: string;
  category: AIExecutionIntelligenceCategory;
  priority: AIExecutionIntelligenceSeverity;
  title: string;
  rationale: string;
  expectedImpact: string;
}