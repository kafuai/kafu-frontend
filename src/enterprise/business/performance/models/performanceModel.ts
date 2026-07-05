import { PerformancePeriod } from "../types/performanceTypes";

export interface PerformanceRecord {
  id: string;
  employeeId: string;
  organizationId: string;
  period: PerformancePeriod;
  score: number;
  completedTasks: number;
  targetTasks: number;
  createdAt: number;
}