export interface PerformanceReview {
  employeeId: string;
  reviewerId: string;
  score: number;
  comments: string;
}

export function createPerformanceReview(
  review: PerformanceReview
): PerformanceReview {
  return review;
}

export function hasReviewComments(
  review: PerformanceReview
): boolean {
  return review.comments.length > 0;
}
