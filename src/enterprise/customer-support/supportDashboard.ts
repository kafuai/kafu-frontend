import { SupportMetrics } from "./supportMetrics";

export interface SupportDashboard {
  metrics: SupportMetrics;
  refreshedAt: Date;
}
