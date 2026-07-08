export interface PayEquityAssessment {
  group: string;
  averageCompensation: number;
  targetCompensation: number;
}

export function calculatePayGap(
  assessment: PayEquityAssessment
): number {
  return (
    assessment.targetCompensation -
    assessment.averageCompensation
  );
}

export function hasPayGap(
  assessment: PayEquityAssessment
): boolean {
  return calculatePayGap(assessment) > 0;
}
