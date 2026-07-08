import type { FPABudget } from "./fpaBudget";
import type { FPAForecast } from "./fpaForecast";
import type { FPASummary } from "./fpaTypes";

export interface FPAReport {
  id: string;
  title: string;
  generatedAt: string;
  summary: FPASummary;
  budgets: FPABudget[];
  forecasts: FPAForecast[];
}

export function buildReportOverview(report: FPAReport) {
  return {
    reportId: report.id,
    title: report.title,
    budgetCount: report.budgets.length,
    forecastCount: report.forecasts.length,
    generatedAt: report.generatedAt,
  };
}
