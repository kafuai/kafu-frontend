import { AIAccountabilitySeverity } from "./aiAccountabilityTypes";

export type AIAccountabilityReviewOutcome =
  | "approved"
  | "changes_required"
  | "escalated"
  | "rejected";

export interface AIAccountabilityReviewFinding {
  id: string;
  severity: AIAccountabilitySeverity;
  title: string;
  description: string;
  recommendation?: string;
}

export interface AIAccountabilityReview {
  id: string;
  organizationId: string;
  decisionId: string;
  reviewerId: string;
  outcome: AIAccountabilityReviewOutcome;
  findings: AIAccountabilityReviewFinding[];
  notes?: string;
  reviewedAt: Date;
}

export interface CreateAIAccountabilityReviewInput {
  id: string;
  organizationId: string;
  decisionId: string;
  reviewerId: string;
  outcome: AIAccountabilityReviewOutcome;
  findings?: AIAccountabilityReviewFinding[];
  notes?: string;
}

export function createAIAccountabilityReview(
  input: CreateAIAccountabilityReviewInput,
  now: Date = new Date(),
): AIAccountabilityReview {
  return {
    id: input.id,
    organizationId: input.organizationId,
    decisionId: input.decisionId,
    reviewerId: input.reviewerId,
    outcome: input.outcome,
    findings: input.findings ?? [],
    notes: input.notes,
    reviewedAt: now,
  };
}

export function reviewHasCriticalFindings(
  review: AIAccountabilityReview,
): boolean {
  return review.findings.some((finding) => finding.severity === "critical");
}

export function reviewRequiresFollowUp(
  review: AIAccountabilityReview,
): boolean {
  return (
    review.outcome === "changes_required" ||
    review.outcome === "escalated" ||
    reviewHasCriticalFindings(review)
  );
}