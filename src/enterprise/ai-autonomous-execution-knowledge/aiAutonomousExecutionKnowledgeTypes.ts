export type AIExecutionKnowledgeType =
  | "execution-pattern"
  | "failure-pattern"
  | "recovery-pattern"
  | "optimization-pattern"
  | "adaptation-pattern"
  | "intelligence-insight"
  | "operational-lesson";

export type AIExecutionKnowledgeScope =
  | "task"
  | "workflow"
  | "agent"
  | "system"
  | "tenant"
  | "enterprise";

export type AIExecutionKnowledgeReliability =
  | "experimental"
  | "observed"
  | "validated"
  | "trusted";

export type AIExecutionKnowledgeStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "archived";

export type AIExecutionKnowledgeSource =
  | "execution"
  | "monitoring"
  | "resilience"
  | "recovery"
  | "adaptation"
  | "intelligence"
  | "manual";

export type AIExecutionKnowledgeImpactLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface AIExecutionKnowledgeEvidence {
  id: string;
  source: AIExecutionKnowledgeSource;
  referenceId: string;
  summary: string;
  confidence: number;
  observedAt: Date;
}

export interface AIExecutionKnowledgeMetrics {
  confidence: number;
  reusability: number;
  strategicValue: number;
  operationalImpact: number;
  riskReduction: number;
}

export interface AIExecutionKnowledgeContext {
  tenantId?: string;
  workflowId?: string;
  executionId?: string;
  agentId?: string;
  taskId?: string;
  environment?: string;
  milestone?: string;
}

export interface AIExecutionKnowledgeRecommendation {
  id: string;
  title: string;
  action: string;
  priority: AIExecutionKnowledgeImpactLevel;
  expectedImpact: string;
  confidence: number;
}