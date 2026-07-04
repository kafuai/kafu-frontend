import { AIAgentCollaborationReport } from "./aiAgentCollaborationReporter";

export interface AIAgentCollaborationDashboard {
  teamId: string;
  healthScore: number;
  status: "healthy" | "watch" | "critical";
  summary: string;
  generatedAt: Date;
}

export function createAIAgentCollaborationDashboard(
  report: AIAgentCollaborationReport,
): AIAgentCollaborationDashboard {
  return {
    teamId: report.teamId,
    healthScore: report.healthScore,
    status:
      report.healthScore >= 80
        ? "healthy"
        : report.healthScore >= 50
          ? "watch"
          : "critical",
    summary: report.summary,
    generatedAt: new Date(),
  };
}