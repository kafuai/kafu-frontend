import { SupportMetrics } from "./supportMetrics";

export interface SupportReport {
  metrics: SupportMetrics;
  generatedAt: Date;
}
