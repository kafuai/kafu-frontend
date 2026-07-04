export type AutomationScheduleType =
  | "immediate"
  | "delayed"
  | "recurring";

export type AutomationSchedule = {
  type: AutomationScheduleType;
  runAt?: Date;
  intervalMs?: number;
};

export function createImmediateAutomationSchedule(): AutomationSchedule {
  return {
    type: "immediate",
  };
}

export function createDelayedAutomationSchedule(
  runAt: Date,
): AutomationSchedule {
  return {
    type: "delayed",
    runAt,
  };
}