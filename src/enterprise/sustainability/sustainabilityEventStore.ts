import { SustainabilityEvent, SustainabilityEventType } from "./sustainabilityEvents";

export class SustainabilityEventStore {
  private readonly events: SustainabilityEvent[] = [];

  append(event: SustainabilityEvent): void {
    this.events.push(event);
  }

  appendMany(events: SustainabilityEvent[]): void {
    events.forEach((event) => this.append(event));
  }

  listByOrganization(organizationId: string): SustainabilityEvent[] {
    return this.events.filter(
      (event) => event.organizationId === organizationId,
    );
  }

  listByType(type: SustainabilityEventType): SustainabilityEvent[] {
    return this.events.filter((event) => event.type === type);
  }

  clear(): void {
    this.events.length = 0;
  }
}