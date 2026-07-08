export interface PerformanceEvaluation {
  employeeId: string;
  score: number;
  rating: string;
  completed: boolean;
}

export function completeEvaluation(
  evaluation: PerformanceEvaluation
): PerformanceEvaluation {
  return {
    ...evaluation,
    completed: true,
  };
}

export function isEvaluationCompleted(
  evaluation: PerformanceEvaluation
): boolean {
  return evaluation.completed;
}
