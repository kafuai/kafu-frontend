import type {
  ActivityStatus,
  EnterpriseExecutionActivity,
} from "./activityTypes";

export function transitionActivityStatus(
  activity: EnterpriseExecutionActivity,
  nextStatus: ActivityStatus
): EnterpriseExecutionActivity {
  return {
    ...activity,
    status: nextStatus,
    progress:
      nextStatus === "completed"
        ? 100
        : activity.progress,
    updatedAt: new Date().toISOString(),
  };
}

export function updateActivityProgress(
  activity: EnterpriseExecutionActivity,
  progress: number
): EnterpriseExecutionActivity {
  const normalized = Math.max(0, Math.min(100, progress));

  return {
    ...activity,
    progress: normalized,
    status: normalized === 100 ? "completed" : activity.status,
    updatedAt: new Date().toISOString(),
  };
}