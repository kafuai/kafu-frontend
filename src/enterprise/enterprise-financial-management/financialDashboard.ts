import { FinancialMetrics } from "./financialMetrics";
import { FinancialRisk } from "./financialRisk";

export interface FinancialDashboard {
  id: string;
  title: string;
  metrics: FinancialMetrics;
  risks: FinancialRisk[];
  alerts: string[];
  updatedAt: string;
}