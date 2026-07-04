import type { EnterpriseExecutionActivity } from "./activityTypes";

export function validateActivity(activity: EnterpriseExecutionActivity): string[] {
  const errors: string[] = [];

  if (!activity.id.trim()) errors.push("Activity id is required.");
  if (!activity.taskId.trim()) errors.push("Task id is required.");
  if (!activity.title.trim()) errors.push("Activity title is required.");
  if (!activity.description.trim()) errors.push("Activity description is required.");
  if (!activity.owner.trim()) errors.push("Activity owner is required.");

  if (activity.progress < 0 || activity.progress > 100) {
    errors.push("Activity progress must be between 0 and 100.");
  }

  if (activity.status === "completed" && activity.progress !== 100) {
    errors.push("Completed activities must have 100 progress.");
  }

  if (activity.status === "blocked" && activity.blockers.length === 0) {
    errors.push("Blocked activities must include at least one blocker.");
  }

  return errors;
}

export function isActivityValid(activity: EnterpriseExecutionActivity): boolean {
  return validateActivity(activity).length === 0;
}