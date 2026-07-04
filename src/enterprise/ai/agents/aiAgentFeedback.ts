export type AIAgentFeedbackRating =
  | "poor"
  | "fair"
  | "good"
  | "excellent";

export interface AIAgentFeedback {
  id: string;
  organizationId: string;
  agentId: string;
  executionId?: string;
  rating: AIAgentFeedbackRating;
  comment: string;
  submittedBy: string;
  submittedAt: Date;
}

export function createAIAgentFeedback(
  id: string,
  organizationId: string,
  agentId: string,
  rating: AIAgentFeedbackRating,
  comment: string,
  submittedBy: string,
  executionId?: string,
): AIAgentFeedback {
  return {
    id,
    organizationId,
    agentId,
    executionId,
    rating,
    comment,
    submittedBy,
    submittedAt: new Date(),
  };
}