import { Incident } from "./incidentTypes";
import {
  calculateIncidentMetrics,
  IncidentMetrics,
} from "./incidentMetrics";

export type IncidentDashboard = {
  metrics: IncidentMetrics;
  recentIncidents: Incident[];
};

export function createIncidentDashboard(
  incidents: Incident[],
): IncidentDashboard {
  return {
    metrics: calculateIncidentMetrics(incidents),
    recentIncidents: [...incidents]
      .sort(
        (a, b) =>
          b.createdAt.getTime() - a.createdAt.getTime(),
      )
      .slice(0, 10),
  };
}