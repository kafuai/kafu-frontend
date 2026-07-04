import {
  AIExecutionKnowledgeContext,
  AIExecutionKnowledgeEvidence,
  AIExecutionKnowledgeMetrics,
  AIExecutionKnowledgeRecommendation,
  AIExecutionKnowledgeReliability,
  AIExecutionKnowledgeScope,
  AIExecutionKnowledgeStatus,
  AIExecutionKnowledgeType,
} from "./aiAutonomousExecutionKnowledgeTypes";

export interface AIExecutionKnowledgeRecord {
  id: string;
  title: string;
  summary: string;
  type: AIExecutionKnowledgeType;
  scope: AIExecutionKnowledgeScope;
  reliability: AIExecutionKnowledgeReliability;
  status: AIExecutionKnowledgeStatus;
  context: AIExecutionKnowledgeContext;
  evidence: AIExecutionKnowledgeEvidence[];
  metrics: AIExecutionKnowledgeMetrics;
  recommendations: AIExecutionKnowledgeRecommendation[];
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIExecutionKnowledgeRecordInput {
  id: string;
  title: string;
  summary: string;
  type: AIExecutionKnowledgeType;
  scope: AIExecutionKnowledgeScope;
  reliability?: AIExecutionKnowledgeReliability;
  status?: AIExecutionKnowledgeStatus;
  context?: AIExecutionKnowledgeContext;
  evidence?: AIExecutionKnowledgeEvidence[];
  metrics?: Partial<AIExecutionKnowledgeMetrics>;
  recommendations?: AIExecutionKnowledgeRecommendation[];
  tags?: string[];
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const defaultMetrics: AIExecutionKnowledgeMetrics = {
  confidence: 0.5,
  reusability: 0.5,
  strategicValue: 0.5,
  operationalImpact: 0.5,
  riskReduction: 0.5,
};

export function createAIExecutionKnowledgeRecord(
  input: AIExecutionKnowledgeRecordInput,
): AIExecutionKnowledgeRecord {
  const now = new Date();

  return {
    id: input.id,
    title: input.title.trim(),
    summary: input.summary.trim(),
    type: input.type,
    scope: input.scope,
    reliability: input.reliability ?? "observed",
    status: input.status ?? "draft",
    context: input.context ?? {},
    evidence: input.evidence ?? [],
    metrics: {
      ...defaultMetrics,
      ...input.metrics,
    },
    recommendations: input.recommendations ?? [],
    tags: Array.from(new Set((input.tags ?? []).map((tag) => tag.trim()).filter(Boolean))),
    createdBy: input.createdBy,
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  };
}

export function activateAIExecutionKnowledgeRecord(
  record: AIExecutionKnowledgeRecord,
): AIExecutionKnowledgeRecord {
  return {
    ...record,
    status: "active",
    updatedAt: new Date(),
  };
}

export function deprecateAIExecutionKnowledgeRecord(
  record: AIExecutionKnowledgeRecord,
): AIExecutionKnowledgeRecord {
  return {
    ...record,
    status: "deprecated",
    updatedAt: new Date(),
  };
}

export function archiveAIExecutionKnowledgeRecord(
  record: AIExecutionKnowledgeRecord,
): AIExecutionKnowledgeRecord {
  return {
    ...record,
    status: "archived",
    updatedAt: new Date(),
  };
}