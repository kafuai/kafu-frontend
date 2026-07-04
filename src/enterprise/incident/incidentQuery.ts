import {
  Incident,
  IncidentSeverity,
  IncidentStatus,
} from "./incidentTypes";

export type IncidentQuery = {
  organizationId?: string;
  status?: IncidentStatus;
  severity?: IncidentSeverity;
  serviceId?: string;
  tag?: string;
};

export function queryIncidents(
  incidents: Incident[],
  query: IncidentQuery,
): Incident[] {
  return incidents.filter((incident) => {
    if (
      query.organizationId &&
      incident.organizationId !== query.organizationId
    ) {
      return false;
    }

    if (query.status && incident.status !== query.status) {
      return false;
    }

    if (query.severity && incident.severity !== query.severity) {
      return false;
    }

    if (
      query.serviceId &&
      !incident.affectedServices.includes(query.serviceId)
    ) {
      return false;
    }

    if (query.tag && !incident.tags.includes(query.tag)) {
      return false;
    }

    return true;
  });
}