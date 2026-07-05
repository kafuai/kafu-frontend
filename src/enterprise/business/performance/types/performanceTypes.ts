export type PerformancePeriod =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly";

export interface PerformanceRecordInput {
  employeeId: string;
  organizationId: string;
  period: PerformancePeriod;
  score: number;
  completedTasks: number;
  targetTasks: number;
}