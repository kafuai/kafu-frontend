export interface PerformanceFeedback {
  employeeId: string;
  managerId: string;
  feedback: string;
  submittedAt: string;
}

export function hasPerformanceFeedback(
  feedback: PerformanceFeedback
): boolean {
  return feedback.feedback.length > 0;
}

export function createFeedback(
  feedback: PerformanceFeedback
): PerformanceFeedback {
  return feedback;
}
