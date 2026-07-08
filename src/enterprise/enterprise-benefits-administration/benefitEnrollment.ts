export interface BenefitEnrollment {
  employeeId: string;
  benefitId: string;
  enrolledAt: string;
  active: boolean;
}

export function activateEnrollment(
  enrollment: BenefitEnrollment
): BenefitEnrollment {
  return {
    ...enrollment,
    active: true,
  };
}

export function isEnrollmentActive(
  enrollment: BenefitEnrollment
): boolean {
  return enrollment.active;
}
