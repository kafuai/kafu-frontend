import { EnterpriseRiskAssessment } from "./riskAssessment";

export class EnterpriseRiskAssessmentRegistry {
  private readonly assessments = new Map<
    string,
    EnterpriseRiskAssessment
  >();

  register(
    assessment: EnterpriseRiskAssessment,
  ): void {
    this.assessments.set(
      assessment.assessmentId,
      assessment,
    );
  }

  get(
    assessmentId: string,
  ): EnterpriseRiskAssessment | undefined {
    return this.assessments.get(assessmentId);
  }

  list(): EnterpriseRiskAssessment[] {
    return [...this.assessments.values()];
  }

  remove(assessmentId: string): boolean {
    return this.assessments.delete(assessmentId);
  }

  clear(): void {
    this.assessments.clear();
  }
}