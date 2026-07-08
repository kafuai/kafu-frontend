export interface WorkforceDemand {
  role: string;
  quantity: number;
  priority: "low" | "medium" | "high";
}

export function isCriticalDemand(
  demand: WorkforceDemand
): boolean {
  return demand.priority === "high";
}
