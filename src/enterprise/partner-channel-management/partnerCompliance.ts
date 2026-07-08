export type PartnerComplianceStatus =
  | "compliant"
  | "review_required"
  | "non_compliant";

export interface PartnerComplianceReview {
  partnerId: string;
  status: PartnerComplianceStatus;
  findings: string[];
  reviewedAt: Date;
}

export function requiresComplianceReview(
  review: PartnerComplianceReview,
): boolean {
  return review.status !== "compliant";
}
