import { Incident } from "./incidentTypes";

export type IncidentResponse = {
  incidentId: string;
  executedAt: Date;
  actions: string[];
};

export function createIncidentResponse(
  incident: Incident,
  actions: string[],
): IncidentResponse {
  return {
    incidentId: incident.id,
    executedAt: new Date(),
    actions,
  };
}