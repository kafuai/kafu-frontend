import type { ResourceAllocation } from "./resourceAllocation";

export class ResourceAllocationRegistry {
  private readonly allocations = new Map<string, ResourceAllocation>();

  register(allocation: ResourceAllocation): void {
    this.allocations.set(allocation.id, allocation);
  }

  get(allocationId: string): ResourceAllocation | undefined {
    return this.allocations.get(allocationId);
  }

  has(allocationId: string): boolean {
    return this.allocations.has(allocationId);
  }

  list(): readonly ResourceAllocation[] {
    return Array.from(this.allocations.values());
  }

  remove(allocationId: string): boolean {
    return this.allocations.delete(allocationId);
  }
}