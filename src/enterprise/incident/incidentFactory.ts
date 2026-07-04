import {
  Incident,
  IncidentCreateInput,
} from "./incidentTypes";

export function createIncident(input: IncidentCreateInput): Incident {
  const now = new Date();

  return {
    id: crypto.randomUUID(),
    organizationId: input.organizationId,
    title: input.title,
    description: input.description,
    severity: input.severity,
    status: "open",
    source: input.source,
    impact: input.impact ?? "minor",
    affectedServices: input.affectedServices ?? [],
    tags: input.tags ?? [],
    createdAt: now,
    updatedAt: now,
  };
}