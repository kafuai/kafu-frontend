import { ProcurementAnalytics } from "./procurementAnalytics";
import { ProcurementMetrics } from "./procurementMetrics";

export interface ProcurementReport {
  id: string;
  title: string;
  metrics: ProcurementMetrics;
  analytics: ProcurementAnalytics;
  generatedAt: string;
}