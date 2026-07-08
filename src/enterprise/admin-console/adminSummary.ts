import { AdminMetrics } from "./adminMetrics";

export interface AdminSummary {
  metrics: AdminMetrics;
  createdAt: Date;
}

export function createAdminSummary(
  metrics: AdminMetrics,
): AdminSummary {
  return {
    metrics,
    createdAt: new Date(),
  };
}
