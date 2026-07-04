import {
  AIAutonomousLearningAuditMetadata,
  AIAutonomousLearningConfidence,
  AIAutonomousLearningImpact,
  AIAutonomousLearningPriority,
} from "./aiAutonomousLearningTypes";
import { AIAutonomousLearningSignal } from "./aiAutonomousLearningSignal";

export interface AIAutonomousLearningInsight {
  id: string;
  organizationId: string;
  title: string;
  summary: string;
  impact: AIAutonomousLearningImpact;
  confidence: AIAutonomousLearningConfidence;
  priority: AIAutonomousLearningPriority;
  relatedSignalIds: string[];
  recommendedActions: string[];
  tags: string[];
  metadata: AIAutonomousLearningAuditMetadata;
}

export interface CreateAIAutonomousLearningInsightInput {
  id: string;
  organizationId: string;
  title: string;
  summary: string;
  impact: AIAutonomousLearningImpact;
  confidence: AIAutonomousLearningConfidence;
  priority: AIAutonomousLearningPriority;
  relatedSignalIds?: string[];
  recommendedActions?: string[];
  tags?: string[];
  createdBy: string;
}

export function createAIAutonomousLearningInsight(
  input: CreateAIAutonomousLearningInsightInput,
): AIAutonomousLearningInsight {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    title: input.title,
    summary: input.summary,
    impact: input.impact,
    confidence: input.confidence,
    priority: input.priority,
    relatedSignalIds: input.relatedSignalIds ?? [],
    recommendedActions: input.recommendedActions ?? [],
    tags: input.tags ?? [],
    metadata: {
      createdAt: now,
      updatedAt: now,
      createdBy: input.createdBy,
    },
  };
}

export function deriveAIAutonomousLearningInsightFromSignals(
  id: string,
  organizationId: string,
  title: string,
  summary: string,
  signals: AIAutonomousLearningSignal[],
  createdBy: string,
): AIAutonomousLearningInsight {
  const negativeSignals = signals.filter((signal) => signal.impact === "negative");
  const mixedSignals = signals.filter((signal) => signal.impact === "mixed");
  const highConfidenceSignals = signals.filter((signal) => signal.confidence === "high");

  const impact: AIAutonomousLearningImpact =
    negativeSignals.length > 0 ? "negative" : mixedSignals.length > 0 ? "mixed" : "positive";

  const confidence: AIAutonomousLearningConfidence =
    highConfidenceSignals.length >= Math.ceil(signals.length / 2) ? "high" : "medium";

  const priority: AIAutonomousLearningPriority =
    negativeSignals.length > 0 ? "high" : mixedSignals.length > 0 ? "medium" : "low";

  return createAIAutonomousLearningInsight({
    id,
    organizationId,
    title,
    summary,
    impact,
    confidence,
    priority,
    relatedSignalIds: signals.map((signal) => signal.id),
    recommendedActions: negativeSignals.length > 0 ? ["Review failure pattern", "Create improvement plan"] : [],
    tags: Array.from(new Set(signals.flatMap((signal) => signal.tags))),
    createdBy,
  });
}