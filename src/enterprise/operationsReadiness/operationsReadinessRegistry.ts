import type { OperationsReadinessAssessment } from "./operationsReadinessAssessment";

export class OperationsReadinessRegistry {
  private readonly assessments = new Map<string, OperationsReadinessAssessment>();

  register(assessment: OperationsReadinessAssessment): void {
    this.assessments.set(assessment.id, assessment);
  }

  getById(id: string): OperationsReadinessAssessment | undefined {
    return this.assessments.get(id);
  }

  list(): readonly OperationsReadinessAssessment[] {
    return Array.from(this.assessments.values());
  }

  listReadyAssessments(): readonly OperationsReadinessAssessment[] {
    return this.list().filter(
      (assessment) =>
        assessment.level === "ready" || assessment.level === "optimized",
    );
  }

  listBlockedAssessments(): readonly OperationsReadinessAssessment[] {
    return this.list().filter(
      (assessment) =>
        assessment.blockers.length > 0 ||
        assessment.signals.some((signal) => signal.status === "critical"),
    );
  }

  clear(): void {
    this.assessments.clear();
  }
}