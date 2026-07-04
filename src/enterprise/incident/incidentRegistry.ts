import {
  Incident,
  IncidentStatus,
} from "./incidentTypes";

export class IncidentRegistry {
  private readonly incidents = new Map<string, Incident>();

  register(incident: Incident): Incident {
    this.incidents.set(incident.id, incident);
    return incident;
  }

  getById(id: string): Incident | undefined {
    return this.incidents.get(id);
  }

  list(): Incident[] {
    return Array.from(this.incidents.values());
  }

  listByOrganization(organizationId: string): Incident[] {
    return this.list().filter(
      (incident) => incident.organizationId === organizationId,
    );
  }

  listByStatus(status: IncidentStatus): Incident[] {
    return this.list().filter(
      (incident) => incident.status === status,
    );
  }

  update(incident: Incident): Incident {
    const updatedIncident: Incident = {
      ...incident,
      updatedAt: new Date(),
    };

    this.incidents.set(updatedIncident.id, updatedIncident);

    return updatedIncident;
  }

  remove(id: string): boolean {
    return this.incidents.delete(id);
  }
}