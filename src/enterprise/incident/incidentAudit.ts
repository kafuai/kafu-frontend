import { IncidentEvent } from "./incidentEvents";

export class IncidentAuditLog {
  private readonly events: IncidentEvent[] = [];

  record(event: IncidentEvent): void {
    this.events.push(event);
  }

  list(): IncidentEvent[] {
    return [...this.events];
  }

  listByIncident(incidentId: string): IncidentEvent[] {
    return this.events.filter(
      (event) => event.incidentId === incidentId,
    );
  }
}