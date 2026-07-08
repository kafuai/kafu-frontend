export interface LearningProgress {
  employeeId: string;
  courseId: string;
  completedLessons: number;
  totalLessons: number;
}

export function calculateLearningProgress(
  progress: LearningProgress
): number {
  if (!progress.totalLessons) return 0;

  return Math.round(
    (progress.completedLessons /
      progress.totalLessons) *
      100
  );
}
