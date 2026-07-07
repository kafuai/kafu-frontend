import { GoToMarketDashboard } from "./goToMarketDashboard";

export interface GoToMarketReport {
  id: string;
  dashboard: GoToMarketDashboard;
  summary: string;
  generatedAt: string;
}

export function generateGoToMarketReport(
  dashboard: GoToMarketDashboard,
): GoToMarketReport {
  return {
    id: `gtm-report-${Date.now()}`,
    dashboard,
    summary: `Go-To-Market plan ${dashboard.planName} is currently in ${dashboard.stage} stage with ${dashboard.metrics.achievementRate}% target achievement.`,
    generatedAt: new Date().toISOString(),
  };
}