import { AIAgentTeam } from "./aiAgentTeam";
import {
  AIAgentTeamCoordinationPlan,
  createAIAgentTeamCoordinationPlan,
} from "./aiAgentTeamCoordinator";
import {
  AIAgentCollaborationEvent,
  createAIAgentCollaborationEvent,
} from "./aiAgentCollaborationEvents";
import {
  AIAgentCollaborationMetrics,
  calculateAIAgentCollaborationMetrics,
} from "./aiAgentCollaborationMetrics";
import {
  AIAgentCollaborationReport,
  createAIAgentCollaborationReport,
} from "./aiAgentCollaborationReporter";

export interface AIAgentCollaborationRuntimeInput {
  executionId: string;
  team: AIAgentTeam;
}

export interface AIAgentCollaborationRuntimeResult {
  executionId: string;
  teamId: string;
  plan: AIAgentTeamCoordinationPlan;
  events: AIAgentCollaborationEvent[];
  metrics: AIAgentCollaborationMetrics;
  report: AIAgentCollaborationReport;
  completedAt: Date;
}

export function runAIAgentCollaborationRuntime(
  input: AIAgentCollaborationRuntimeInput,
): AIAgentCollaborationRuntimeResult {
  const plan = createAIAgentTeamCoordinationPlan(input.team);

  const events = [
    createAIAgentCollaborationEvent({
      id: `${input.executionId}:team_activated`,
      type: "team_activated",
      teamId: input.team.id,
      description: `AI agent team activated: ${input.team.name}`,
      createdAt: new Date(),
    }),
    createAIAgentCollaborationEvent({
      id: `${input.executionId}:runtime_completed`,
      type: "runtime_completed",
      teamId: input.team.id,
      description: "AI agent collaboration runtime completed",
      createdAt: new Date(),
    }),
  ];

  const metrics = calculateAIAgentCollaborationMetrics(input.team.id, events);
  const report = createAIAgentCollaborationReport(metrics);

  return {
    executionId: input.executionId,
    teamId: input.team.id,
    plan,
    events,
    metrics,
    report,
    completedAt: new Date(),
  };
}