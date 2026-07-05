import type { Capacity } from "./capacity";

export class CapacityRegistry {
  private readonly capacities = new Map<string, Capacity>();

  register(capacity: Capacity): void {
    this.capacities.set(capacity.id, capacity);
  }

  get(capacityId: string): Capacity | undefined {
    return this.capacities.get(capacityId);
  }

  has(capacityId: string): boolean {
    return this.capacities.has(capacityId);
  }

  list(): readonly Capacity[] {
    return Array.from(this.capacities.values());
  }

  remove(capacityId: string): boolean {
    return this.capacities.delete(capacityId);
  }
}