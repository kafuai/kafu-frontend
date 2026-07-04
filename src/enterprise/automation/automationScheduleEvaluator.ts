import { AutomationSchedule } from "./automationSchedule";

export function isAutomationScheduleDue(
  schedule: AutomationSchedule,
  now: Date = new Date(),
): boolean {
  if (schedule.type === "immediate") return true;

  if (schedule.type === "delayed") {
    return schedule.runAt ? schedule.runAt.getTime() <= now.getTime() : false;
  }

  if (schedule.type === "recurring") {
    return typeof schedule.intervalMs === "number";
  }

  return false;
}