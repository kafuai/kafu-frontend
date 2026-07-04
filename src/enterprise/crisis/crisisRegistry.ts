import { Crisis, CrisisStatus } from "./crisisTypes";

export class CrisisRegistry {
  private readonly crises = new Map<string, Crisis>();

  register(crisis: Crisis): Crisis {
    this.crises.set(crisis.id, crisis);
    return crisis;
  }

  getById(crisisId: string): Crisis | undefined {
    return this.crises.get(crisisId);
  }

  listByOrganization(organizationId: string): Crisis[] {
    return Array.from(this.crises.values()).filter(
      (crisis) => crisis.organizationId === organizationId,
    );
  }

  listByStatus(organizationId: string, status: CrisisStatus): Crisis[] {
    return this.listByOrganization(organizationId).filter(
      (crisis) => crisis.status === status,
    );
  }

  updateStatus(crisisId: string, status: CrisisStatus): Crisis | undefined {
    const crisis = this.crises.get(crisisId);

    if (!crisis) {
      return undefined;
    }

    const updated: Crisis = {
      ...crisis,
      status,
      resolvedAt:
        status === "resolved" || status === "closed"
          ? new Date().toISOString()
          : crisis.resolvedAt,
    };

    this.crises.set(crisisId, updated);
    return updated;
  }

  remove(crisisId: string): boolean {
    return this.crises.delete(crisisId);
  }
}