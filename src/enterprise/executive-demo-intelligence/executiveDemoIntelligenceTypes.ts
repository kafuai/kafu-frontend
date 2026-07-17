export type ExecutiveDemoIntelligencePriority =
  | "critical"
  | "high"
  | "medium"
  | "low";

export type ExecutiveDemoIntelligenceConfidence =
  | "high"
  | "medium"
  | "low";

export type ExecutiveDemoIntelligenceSignalType =
  | "risk"
  | "opportunity"
  | "readiness"
  | "performance"
  | "execution"
  | "engagement";

export type ExecutiveDemoIntelligenceObjectiveType =
  | "demonstrate-value"
  | "expose-risk"
  | "accelerate-decision"
  | "build-confidence"
  | "recommend-action";

export interface ExecutiveDemoIntelligenceSignal {
  id: string;
  type: ExecutiveDemoIntelligenceSignalType;
  title: string;
  description: string;
  score: number;
  priority: ExecutiveDemoIntelligencePriority;
  source: string;
  detectedAt: string;
  evidence: string[];
}

export interface ExecutiveDemoIntelligenceKnowledgeItem {
  id: string;
  category: string;
  title: string;
  summary: string;
  relevanceScore: number;
  source: string;
  tags: string[];
}

export interface ExecutiveDemoIntelligenceMemoryItem {
  id: string;
  sessionId: string;
  organizationId: string;
  key: string;
  value: string;
  importance: ExecutiveDemoIntelligencePriority;
  createdAt: string;
}

export interface ExecutiveDemoIntelligenceObjective {
  id: string;
  type: ExecutiveDemoIntelligenceObjectiveType;
  title: string;
  description: string;
  priority: ExecutiveDemoIntelligencePriority;
  successCriteria: string[];
}

export interface ExecutiveDemoIntelligenceContext {
  sessionId: string;
  organizationId: string;
  companyName: string;
  industry?: string;
  country?: string;
  executiveRole?: string;
  readinessScore?: number;
  corporateBrainScore?: number;
  discoveryAnswersCount?: number;
  overdueLeads?: number;
  activeModules?: string[];
  currentStage?: string;
  capturedAt: string;
}

export interface ExecutiveDemoIntelligenceInput {
  context: ExecutiveDemoIntelligenceContext;
  signals?: ExecutiveDemoIntelligenceSignal[];
  knowledge?: ExecutiveDemoIntelligenceKnowledgeItem[];
  memory?: ExecutiveDemoIntelligenceMemoryItem[];
  objectives?: ExecutiveDemoIntelligenceObjective[];
}

export interface ExecutiveDemoIntelligenceInsight {
  id: string;
  title: string;
  summary: string;
  rationale: string;
  priority: ExecutiveDemoIntelligencePriority;
  confidence: ExecutiveDemoIntelligenceConfidence;
  supportingSignalIds: string[];
  recommendedAction?: string;
}

export interface ExecutiveDemoIntelligenceResult {
  sessionId: string;
  organizationId: string;
  executiveSummary: string;
  insights: ExecutiveDemoIntelligenceInsight[];
  primaryRecommendation: string;
  confidence: ExecutiveDemoIntelligenceConfidence;
  generatedAt: string;
}
