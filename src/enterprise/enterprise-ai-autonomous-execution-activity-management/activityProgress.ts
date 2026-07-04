import type {
  ActivityExecutionSummary,
  EnterpriseExecutionActivity,
  ActivityRiskLevel,
} from "./activityTypes";

const riskOrder: ActivityRiskLevel[] = [
  "none",
  "low",
  "medium",
  "high",
  "critical",
];

export function summarizeActivities(
  activities: EnterpriseExecutionActivity[]
): ActivityExecutionSummary {
  const summary: ActivityExecutionSummary = {
    totalActivities: activities.length,
    planned: 0,
    ready: 0,
    inProgress: 0,
    blocked: 0,
    completed: 0,
    cancelled: 0,
    averageProgress: 0,
    highestRiskLevel: "none",
  };

  let totalProgress = 0;
  let highestRiskIndex = 0;

  for (const activity of activities) {
    totalProgress += activity.progress;

    switch (activity.status) {
      case "planned":
        summary.planned++;
        break;
      case "ready":
        summary.ready++;
        break;
      case "in_progress":
        summary.inProgress++;
        break;
      case "blocked":
        summary.blocked++;
        break;
      case "completed":
        summary.completed++;
        break;
      case "cancelled":
        summary.cancelled++;
        break;
    }

    const riskIndex = riskOrder.indexOf(activity.riskLevel);
    if (riskIndex > highestRiskIndex) {
      highestRiskIndex = riskIndex;
      summary.highestRiskLevel = activity.riskLevel;
    }
  }

  summary.averageProgress =
    activities.length === 0 ? 0 : Math.round(totalProgress / activities.length);

  return summary;
}