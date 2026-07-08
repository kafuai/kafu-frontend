export interface LearningAssessment {
  employeeId: string;
  assessmentName: string;
  score: number;
  passed: boolean;
}

export function isAssessmentPassed(
  assessment: LearningAssessment
): boolean {
  return assessment.passed;
}

export function calculateAssessmentScore(
  assessment: LearningAssessment
): number {
  return assessment.score;
}
