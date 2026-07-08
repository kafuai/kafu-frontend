import { AdminMetrics } from "./adminMetrics";

export interface AdminReport {
  id: string;
  metrics: AdminMetrics;
  generatedAt: Date;
}

export function createAdminReport(
  metrics: AdminMetrics,
): AdminReport {
  return {
    id: crypto.randomUUID(),
    metrics,
    generatedAt: new Date(),
  };
}
