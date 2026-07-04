import { Incident } from "./incidentTypes";
import {
  calculateIncidentMetrics,
} from "./incidentMetrics";

export type IncidentReport = {
  generatedAt: Date;
  totalIncidents: number;
  metrics: ReturnType<typeof calculateIncidentMetrics>;
  incidents: Incident[];
};

export function generateIncidentReport(
  incidents: Incident[],
): IncidentReport {
  return {
    generatedAt: new Date(),
    totalIncidents: incidents.length,
    metrics: calculateIncidentMetrics(incidents),
    incidents,
  };
}