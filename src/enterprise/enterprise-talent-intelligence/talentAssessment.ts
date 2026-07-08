export interface TalentAssessment {
  employeeId: string;
  score: number;
  assessorId: string;
  completed: boolean;
}

export function completeTalentAssessment(
  assessment: TalentAssessment
): TalentAssessment {
  return {
    ...assessment,
    completed: true,
  };
}

export function isAssessmentCompleted(
  assessment: TalentAssessment
): boolean {
  return assessment.completed;
}
