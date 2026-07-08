export interface LearningAnalytics {
  totalCourses: number;
  activeLearners: number;
  completionRate: number;
}

export function calculateLearningCompletion(
  analytics: LearningAnalytics
): number {
  return Math.round(
    analytics.completionRate
  );
}

export function hasLearningData(
  analytics: LearningAnalytics
): boolean {
  return analytics.totalCourses > 0;
}
