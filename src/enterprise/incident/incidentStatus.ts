import {
  Incident,
  IncidentStatus,
} from "./incidentTypes";

export function updateIncidentStatus(
  incident: Incident,
  status: IncidentStatus,
): Incident {
  const now = new Date();

  return {
    ...incident,
    status,
    acknowledgedAt:
      status === "acknowledged"
        ? incident.acknowledgedAt ?? now
        : incident.acknowledgedAt,
    resolvedAt:
      status === "resolved" || status === "closed"
        ? incident.resolvedAt ?? now
        : incident.resolvedAt,
    updatedAt: now,
  };
}