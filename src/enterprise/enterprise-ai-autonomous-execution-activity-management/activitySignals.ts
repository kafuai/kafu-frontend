import type { EnterpriseExecutionActivity } from "./activityTypes";

export interface ActivityOperationalSignal {
  activityId: string;
  signalType: "healthy" | "attention_required" | "blocked" | "at_risk";
  message: string;
  severity: "info" | "warning" | "critical";
}

export function generateActivityOperationalSignals(
  activities: EnterpriseExecutionActivity[]
): ActivityOperationalSignal[] {
  return activities.map((activity) => {
    if (activity.status === "blocked") {
      return {
        activityId: activity.id,
        signalType: "blocked",
        message: "Activity is currently blocked and requires intervention.",
        severity: "critical",
      };
    }

    if (activity.riskLevel === "high" || activity.riskLevel === "critical") {
      return {
        activityId: activity.id,
        signalType: "at_risk",
        message: "Activity has elevated execution risk.",
        severity: activity.riskLevel === "critical" ? "critical" : "warning",
      };
    }

    if (activity.progress < 25 && activity.status === "in_progress") {
      return {
        activityId: activity.id,
        signalType: "attention_required",
        message: "Activity progress is low while execution is already in progress.",
        severity: "warning",
      };
    }

    return {
      activityId: activity.id,
      signalType: "healthy",
      message: "Activity is operating within expected execution parameters.",
      severity: "info",
    };
  });
}