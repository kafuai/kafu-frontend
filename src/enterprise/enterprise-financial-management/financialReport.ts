import { FinancialAnalytics } from "./financialAnalytics";
import { FinancialForecast } from "./financialForecast";
import { FinancialMetrics } from "./financialMetrics";

export interface FinancialReport {
  id: string;
  title: string;
  metrics: FinancialMetrics;
  forecast: FinancialForecast;
  analytics: FinancialAnalytics;
  generatedAt: string;
}