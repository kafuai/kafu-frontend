import { AIHumanOversightLevel } from "./aiGovernanceTypes";

export type AIHumanOversightDecision =
  | "approved"
  | "rejected"
  | "escalated"
  | "requires_more_information";

export interface AIHumanOversightReview {
  id: string;
  organizationId: string;
  useCaseId: string;
  modelId?: string;
  oversightLevel: AIHumanOversightLevel;
  reviewerId: string;
  decision: AIHumanOversightDecision;
  notes: string[];
  reviewedAt: Date;
}

export interface CreateAIHumanOversightReviewInput {
  id: string;
  organizationId: string;
  useCaseId: string;
  modelId?: string;
  oversightLevel: AIHumanOversightLevel;
  reviewerId: string;
  decision: AIHumanOversightDecision;
  notes?: string[];
}

export function createAIHumanOversightReview(
  input: CreateAIHumanOversightReviewInput,
): AIHumanOversightReview {
  return {
    id: input.id,
    organizationId: input.organizationId,
    useCaseId: input.useCaseId,
    modelId: input.modelId,
    oversightLevel: input.oversightLevel,
    reviewerId: input.reviewerId,
    decision: input.decision,
    notes: input.notes ?? [],
    reviewedAt: new Date(),
  };
}

export function requiresOversightApproval(
  oversightLevel: AIHumanOversightLevel,
): boolean {
  return (
    oversightLevel === "approval_required" ||
    oversightLevel === "continuous_monitoring"
  );
}