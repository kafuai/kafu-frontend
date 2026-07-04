import { IncidentSeverity } from "./incidentTypes";

export type IncidentResponsePlan = {
  severity: IncidentSeverity;
  actions: string[];
};

export function createIncidentResponsePlan(
  severity: IncidentSeverity,
): IncidentResponsePlan {
  switch (severity) {
    case "critical":
      return {
        severity,
        actions: [
          "Notify executive team",
          "Start incident bridge",
          "Escalate immediately",
        ],
      };

    case "high":
      return {
        severity,
        actions: [
          "Notify engineering",
          "Assign incident owner",
        ],
      };

    case "medium":
      return {
        severity,
        actions: [
          "Create investigation task",
        ],
      };

    default:
      return {
        severity,
        actions: [
          "Track incident",
        ],
      };
  }
}