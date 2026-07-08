export interface TalentReview {
  employeeId: string;
  reviewerId: string;
  comments: string;
  rating: number;
}

export function hasTalentReviewComments(
  review: TalentReview
): boolean {
  return review.comments.length > 0;
}

export function isHighTalentReview(
  review: TalentReview
): boolean {
  return review.rating >= 4;
}
