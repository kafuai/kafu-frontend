import {
  AIAutonomousLearningAuditMetadata,
  AIAutonomousLearningConfidence,
  AIAutonomousLearningImpact,
} from "./aiAutonomousLearningTypes";

export interface AIAutonomousLearningFeedback {
  id: string;
  organizationId: string;
  signalId?: string;
  actorId: string;
  actorType: string;
  impact: AIAutonomousLearningImpact;
  confidence: AIAutonomousLearningConfidence;
  rating?: number;
  comment: string;
  recommendedAction?: string;
  metadata: AIAutonomousLearningAuditMetadata;
}

export interface CreateAIAutonomousLearningFeedbackInput {
  id: string;
  organizationId: string;
  signalId?: string;
  actorId: string;
  actorType: string;
  impact: AIAutonomousLearningImpact;
  confidence: AIAutonomousLearningConfidence;
  rating?: number;
  comment: string;
  recommendedAction?: string;
  createdBy: string;
}

export function createAIAutonomousLearningFeedback(
  input: CreateAIAutonomousLearningFeedbackInput,
): AIAutonomousLearningFeedback {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    signalId: input.signalId,
    actorId: input.actorId,
    actorType: input.actorType,
    impact: input.impact,
    confidence: input.confidence,
    rating: input.rating,
    comment: input.comment,
    recommendedAction: input.recommendedAction,
    metadata: {
      createdAt: now,
      updatedAt: now,
      createdBy: input.createdBy,
    },
  };
}

export function isActionableAIAutonomousLearningFeedback(
  feedback: AIAutonomousLearningFeedback,
): boolean {
  return Boolean(feedback.recommendedAction) && feedback.confidence !== "low";
}

export function normalizeAIAutonomousLearningFeedbackRating(
  feedback: AIAutonomousLearningFeedback,
): number {
  if (feedback.rating === undefined) {
    return 0;
  }

  return Math.min(5, Math.max(1, feedback.rating));
}