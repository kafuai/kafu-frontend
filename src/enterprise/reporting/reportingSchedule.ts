import { ReportingFrequency } from "./reportingTypes";

export interface ReportingSchedule {
  reportId: string;
  frequency: ReportingFrequency;
  timezone: string;
  nextRunAt?: string;
  enabled: boolean;
}

export function isReportingScheduleDue(schedule: ReportingSchedule, now: string = new Date().toISOString()): boolean {
  return schedule.enabled && !!schedule.nextRunAt && schedule.nextRunAt <= now;
}
