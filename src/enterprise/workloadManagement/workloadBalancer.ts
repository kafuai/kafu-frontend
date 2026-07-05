import type { Workload } from "./workload";

export class WorkloadBalancer {
  balance(
    workloads: readonly Workload[],
  ): readonly Workload[] {
    return [...workloads].sort((a, b) => {
      const utilizationA =
        a.capacityMinutes === 0
          ? Number.POSITIVE_INFINITY
          : a.assignedMinutes / a.capacityMinutes;

      const utilizationB =
        b.capacityMinutes === 0
          ? Number.POSITIVE_INFINITY
          : b.assignedMinutes / b.capacityMinutes;

      return utilizationA - utilizationB;
    });
  }
}