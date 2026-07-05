import { PerformanceRecordInput } from "../types/performanceTypes";

export class PerformanceValidator {
  validateRecord(input: PerformanceRecordInput): boolean {
    return Boolean(
      input.employeeId &&
      input.organizationId &&
      input.period &&
      input.score >= 0 &&
      input.completedTasks >= 0 &&
      input.targetTasks >= 0,
    );
  }
}