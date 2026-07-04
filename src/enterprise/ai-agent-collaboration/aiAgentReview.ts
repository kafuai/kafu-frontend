export type AIAgentReviewStatus = "pending" | "approved" | "rejected";

export interface AIAgentReview {
  id: string;
  reviewerAgentId: string;
  targetId: string;
  score: number;
  status: AIAgentReviewStatus;
  comments: string;
  createdAt: Date;
}

export function createAIAgentReview(review: AIAgentReview): AIAgentReview {
  if (!review.id.trim()) throw new Error("Review id is required");
  if (!review.reviewerAgentId.trim()) throw new Error("Reviewer agent id is required");
  if (!review.targetId.trim()) throw new Error("Review target id is required");
  if (review.score < 0 || review.score > 100) throw new Error("Review score must be between 0 and 100");

  return review;
}

export function approveAIAgentReview(review: AIAgentReview): AIAgentReview {
  return { ...review, status: "approved" };
}

export function rejectAIAgentReview(review: AIAgentReview): AIAgentReview {
  return { ...review, status: "rejected" };
}