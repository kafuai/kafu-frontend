import { AgentCollaborationAnalytics } from "./agentCollaborationAnalytics";
import { AgentCollaborationGovernanceResult } from "./agentCollaborationGovernance";

export interface AgentCollaborationReport {
  summary: string;
  analytics: AgentCollaborationAnalytics;
  governance: AgentCollaborationGovernanceResult;
  generatedAt: Date;
}

export function generateAgentCollaborationReport(
  analytics: AgentCollaborationAnalytics,
  governance: AgentCollaborationGovernanceResult,
): AgentCollaborationReport {
  return {
    summary:
      `Teams: ${analytics.totalTeams}, Agents: ${analytics.totalAgents}, Average Team Size: ${analytics.averageTeamSize.toFixed(1)}`,
    analytics,
    governance,
    generatedAt: new Date(),
  };
}