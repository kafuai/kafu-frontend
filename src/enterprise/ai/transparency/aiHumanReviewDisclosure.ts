export type AIHumanReviewStatus =
  | "not_required"
  | "required"
  | "completed"
  | "escalated";

export interface AIHumanReviewDisclosure {
  id: string;
  transparencyRecordId: string;
  status: AIHumanReviewStatus;
  reviewerRole?: string;
  reviewSummary?: string;
  visibleToEndUser: boolean;
  reviewedAt?: Date;
  createdAt: Date;
}

export interface CreateAIHumanReviewDisclosureInput {
  id: string;
  transparencyRecordId: string;
  status: AIHumanReviewStatus;
  reviewerRole?: string;
  reviewSummary?: string;
  visibleToEndUser?: boolean;
  reviewedAt?: Date;
}

export function createAIHumanReviewDisclosure(
  input: CreateAIHumanReviewDisclosureInput,
): AIHumanReviewDisclosure {
  return {
    id: input.id,
    transparencyRecordId: input.transparencyRecordId,
    status: input.status,
    reviewerRole: input.reviewerRole,
    reviewSummary: input.reviewSummary,
    visibleToEndUser: input.visibleToEndUser ?? true,
    reviewedAt: input.reviewedAt,
    createdAt: new Date(),
  };
}