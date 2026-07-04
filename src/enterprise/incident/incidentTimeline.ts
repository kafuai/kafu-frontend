export type IncidentTimelineEventType =
  | "created"
  | "assigned"
  | "status.changed"
  | "response.started"
  | "response.completed"
  | "escalated"
  | "resolved"
  | "closed";

export type IncidentTimelineEntry = {
  id: string;
  incidentId: string;
  type: IncidentTimelineEventType;
  message: string;
  createdAt: Date;
  actorId?: string;
  metadata?: Record<string, unknown>;
};

export function createIncidentTimelineEntry(
  entry: Omit<IncidentTimelineEntry, "id" | "createdAt">,
): IncidentTimelineEntry {
  return {
    ...entry,
    id: `${entry.incidentId}:${entry.type}:${Date.now()}`,
    createdAt: new Date(),
  };
}

export function listIncidentTimeline(
  incidentId: string,
  entries: IncidentTimelineEntry[],
): IncidentTimelineEntry[] {
  return entries
    .filter((entry) => entry.incidentId === incidentId)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}