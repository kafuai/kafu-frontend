export interface EmployeeFeedback {
  employeeId: string;
  feedback: string;
  rating: number;
  createdAt: string;
}

export function createEmployeeFeedback(
  feedback: EmployeeFeedback
): EmployeeFeedback {
  return {
    ...feedback,
    createdAt: feedback.createdAt || new Date().toISOString(),
  };
}

export function isPositiveFeedback(
  feedback: EmployeeFeedback
): boolean {
  return feedback.rating >= 4;
}
