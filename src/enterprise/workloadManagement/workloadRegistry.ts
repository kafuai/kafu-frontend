import type { Workload } from "./workload";

export class WorkloadRegistry {
  private readonly workloads = new Map<string, Workload>();

  register(workload: Workload): void {
    this.workloads.set(workload.id, workload);
  }

  get(workloadId: string): Workload | undefined {
    return this.workloads.get(workloadId);
  }

  has(workloadId: string): boolean {
    return this.workloads.has(workloadId);
  }

  list(): readonly Workload[] {
    return Array.from(this.workloads.values());
  }

  remove(workloadId: string): boolean {
    return this.workloads.delete(workloadId);
  }
}