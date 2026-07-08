export interface LearningDashboard {
  activeCourses: number;
  learners: number;
  completionScore: number;
  generatedAt: string;
}

export function createLearningDashboard(
  dashboard: LearningDashboard
): LearningDashboard {
  return {
    ...dashboard,
    generatedAt: new Date().toISOString(),
  };
}
