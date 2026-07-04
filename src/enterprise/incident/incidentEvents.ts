import { Incident } from "./incidentTypes";

export type IncidentEventType =
  | "created"
  | "acknowledged"
  | "investigating"
  | "mitigated"
  | "resolved"
  | "closed"
  | "escalated";

export type IncidentEvent = {
  id: string;
  incidentId: string;
  organizationId: string;
  type: IncidentEventType;
  timestamp: Date;
  incident: Incident;
};

export function createIncidentEvent(
  type: IncidentEventType,
  incident: Incident,
): IncidentEvent {
  return {
    id: crypto.randomUUID(),
    incidentId: incident.id,
    organizationId: incident.organizationId,
    type,
    timestamp: new Date(),
    incident,
  };
}