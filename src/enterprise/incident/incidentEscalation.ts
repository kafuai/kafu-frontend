export type IncidentEscalationLevel = "team" | "manager" | "executive";

export type IncidentEscalation = {
  incidentId: string;
  level: IncidentEscalationLevel;
  escalatedBy: string;
  escalatedAt: Date;
  reason: string;
};

export function escalateIncident(
  incidentId: string,
  level: IncidentEscalationLevel,
  escalatedBy: string,
  reason: string,
): IncidentEscalation {
  return {
    incidentId,
    level,
    escalatedBy,
    escalatedAt: new Date(),
    reason,
  };
}