import { ProcurementMetrics } from "./procurementMetrics";
import { ProcurementRisk } from "./procurementRisk";

export interface ProcurementDashboard {
  id: string;
  title: string;
  metrics: ProcurementMetrics;
  risks: ProcurementRisk[];
  alerts: string[];
  updatedAt: string;
}