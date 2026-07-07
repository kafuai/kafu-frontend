import { ProcurementMetrics } from "./procurementMetrics";

export interface ProcurementAnalytics {
  id: string;
  metrics: ProcurementMetrics;
  insights: string[];
  recommendations: string[];
  generatedAt: string;
}