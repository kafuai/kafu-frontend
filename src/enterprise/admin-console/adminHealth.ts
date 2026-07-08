export interface AdminHealth {
  status: "healthy" | "warning" | "critical";
  checkedAt: Date;
}

export function isHealthy(health: AdminHealth): boolean {
  return health.status === "healthy";
}
