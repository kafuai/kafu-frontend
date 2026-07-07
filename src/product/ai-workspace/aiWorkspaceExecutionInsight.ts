import {
  AIAutonomousExecutionPriority,
  AIAutonomousExecutionStatus,
} from "../../enterprise/ai-autonomous-execution";

export interface AIWorkspaceExecutionInsightInput {
  organizationId: string;
  workspaceId: string;
  executionId: string;
  executionTitle: string;
  executionStatus: AIAutonomousExecutionStatus;
  priority: AIAutonomousExecutionPriority;
  blockedTasks: number;
  waitingApprovalTasks: number;
  completedTasks: number;
  totalTasks: number;
}

export interface AIWorkspaceExecutionInsightResult {
  insightTitle: string;
  aiSummary: string;
  priority: AIAutonomousExecutionPriority;
  nextAction: string;
  completionRate: number;
}

export function buildAIWorkspaceExecutionInsight(
  input: AIWorkspaceExecutionInsightInput,
): AIWorkspaceExecutionInsightResult {
  const completionRate =
    input.totalTasks === 0
      ? 0
      : Math.round((input.completedTasks / input.totalTasks) * 100);

  const priority: AIAutonomousExecutionPriority =
    input.blockedTasks > 0
      ? "critical"
      : input.waitingApprovalTasks > 0
        ? "high"
        : input.priority;

  const nextAction =
    input.blockedTasks > 0
      ? "Resolve blocked execution tasks."
      : input.waitingApprovalTasks > 0
        ? "Complete pending approvals."
        : input.executionStatus === "completed"
          ? "Generate execution intelligence."
          : "Continue autonomous execution.";

  return {
    insightTitle: `AI Workspace Insight - ${input.executionTitle}`,
    aiSummary: `${completionRate}% completed • ${input.blockedTasks} blocked • ${input.waitingApprovalTasks} pending approval.`,
    priority,
    nextAction,
    completionRate,
  };
}