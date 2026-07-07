import { FinancialMetrics } from "./financialMetrics";

export interface FinancialAnalytics {
  id: string;
  metrics: FinancialMetrics;
  insights: string[];
  recommendations: string[];
  generatedAt: string;
}