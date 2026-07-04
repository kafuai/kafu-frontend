export type AIAutonomousIntelligenceSignalType =
  | "execution"
  | "governance"
  | "risk"
  | "performance"
  | "compliance"
  | "strategy"
  | "optimization";

export type AIAutonomousIntelligenceSignalSeverity =
  | "info"
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AIAutonomousIntelligenceInsightCategory =
  | "opportunity"
  | "risk"
  | "inefficiency"
  | "policy-gap"
  | "performance-pattern"
  | "strategic-signal";

export type AIAutonomousIntelligenceInsightPriority =
  | "low"
  | "medium"
  | "high"
  | "urgent";

export type AIAutonomousIntelligenceConfidenceLevel =
  | "low"
  | "medium"
  | "high"
  | "very-high";

export type AIAutonomousIntelligenceActionability =
  | "observe"
  | "review"
  | "recommend"
  | "escalate"
  | "execute-ready";

export interface AIAutonomousIntelligenceSourceRef {
  sourceLayer: string;
  sourceId: string;
  sourceType: string;
}

export interface AIAutonomousIntelligenceEvidence {
  id: string;
  label: string;
  value: string | number | boolean;
  weight: number;
  source?: AIAutonomousIntelligenceSourceRef;
}

export interface AIAutonomousIntelligenceRecommendation {
  id: string;
  title: string;
  rationale: string;
  expectedImpact: string;
  actionability: AIAutonomousIntelligenceActionability;
  requiresApproval: boolean;
}