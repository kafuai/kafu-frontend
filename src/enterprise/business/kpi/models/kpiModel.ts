import { KPILevel } from "../types/kpiTypes";

export interface KPIRecord {
  id: string;
  organizationId: string;
  level: KPILevel;
  referenceId: string;
  name: string;
  target: number;
  actual: number;
  achievement: number;
  createdAt: number;
}