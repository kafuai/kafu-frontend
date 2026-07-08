export interface LearningEnrollment {
  employeeId: string;
  courseId: string;
  enrolledAt: string;
  active: boolean;
}

export function activateEnrollment(
  enrollment: LearningEnrollment
): LearningEnrollment {
  return {
    ...enrollment,
    active: true,
  };
}

export function isEnrollmentActive(
  enrollment: LearningEnrollment
): boolean {
  return enrollment.active;
}
