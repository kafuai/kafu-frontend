import {
  AIAutonomousLearningAuditMetadata,
  AIAutonomousLearningConfidence,
  AIAutonomousLearningImpact,
  AIAutonomousLearningSignalType,
} from "./aiAutonomousLearningTypes";

export interface AIAutonomousLearningSignal {
  id: string;
  organizationId: string;
  sourceId: string;
  sourceType: string;
  type: AIAutonomousLearningSignalType;
  impact: AIAutonomousLearningImpact;
  confidence: AIAutonomousLearningConfidence;
  title: string;
  description: string;
  evidence: string[];
  tags: string[];
  metadata: AIAutonomousLearningAuditMetadata;
}

export interface CreateAIAutonomousLearningSignalInput {
  id: string;
  organizationId: string;
  sourceId: string;
  sourceType: string;
  type: AIAutonomousLearningSignalType;
  impact: AIAutonomousLearningImpact;
  confidence: AIAutonomousLearningConfidence;
  title: string;
  description: string;
  evidence?: string[];
  tags?: string[];
  createdBy: string;
}

export function createAIAutonomousLearningSignal(
  input: CreateAIAutonomousLearningSignalInput,
): AIAutonomousLearningSignal {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    sourceId: input.sourceId,
    sourceType: input.sourceType,
    type: input.type,
    impact: input.impact,
    confidence: input.confidence,
    title: input.title,
    description: input.description,
    evidence: input.evidence ?? [],
    tags: input.tags ?? [],
    metadata: {
      createdAt: now,
      updatedAt: now,
      createdBy: input.createdBy,
    },
  };
}

export function isNegativeLearningSignal(signal: AIAutonomousLearningSignal): boolean {
  return signal.impact === "negative" || signal.impact === "mixed";
}

export function hasStrongLearningEvidence(signal: AIAutonomousLearningSignal): boolean {
  return signal.confidence === "high" && signal.evidence.length > 0;
}