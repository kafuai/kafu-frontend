import {
  Incident,
  IncidentSeverity,
  IncidentStatus,
} from "./incidentTypes";

export type IncidentMetrics = {
  total: number;
  open: number;
  acknowledged: number;
  investigating: number;
  mitigated: number;
  resolved: number;
  closed: number;
  bySeverity: Record<IncidentSeverity, number>;
};

export function calculateIncidentMetrics(
  incidents: Incident[],
): IncidentMetrics {
  const countByStatus = (
    status: IncidentStatus,
  ): number =>
    incidents.filter((incident) => incident.status === status)
      .length;

  return {
    total: incidents.length,
    open: countByStatus("open"),
    acknowledged: countByStatus("acknowledged"),
    investigating: countByStatus("investigating"),
    mitigated: countByStatus("mitigated"),
    resolved: countByStatus("resolved"),
    closed: countByStatus("closed"),
    bySeverity: {
      low: incidents.filter((incident) => incident.severity === "low").length,
      medium: incidents.filter((incident) => incident.severity === "medium").length,
      high: incidents.filter((incident) => incident.severity === "high").length,
      critical: incidents.filter((incident) => incident.severity === "critical").length,
    },
  };
}