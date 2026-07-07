import {
  AIAutonomousExecutionPriority,
  AIAutonomousExecutionStatus,
} from "../../enterprise/ai-autonomous-execution";

export interface CommandCenterExecutionLinkInput {
  organizationId: string;
  commandCenterId: string;
  executionId: string;
  executionTitle: string;
  executionStatus: AIAutonomousExecutionStatus;
  priority: AIAutonomousExecutionPriority;
  owner?: string | null;
  blockedTasks: number;
  waitingApprovalTasks: number;
  completedTasks: number;
  totalTasks: number;
}

export interface CommandCenterExecutionLinkResult {
  linkTitle: string;
  executionState: string;
  recommendedAction: string;
  urgency: AIAutonomousExecutionPriority;
  summary: string;
}

export function buildCommandCenterExecutionLink(
  input: CommandCenterExecutionLinkInput,
): CommandCenterExecutionLinkResult {
  const hasBlockedWork = input.blockedTasks > 0;
  const hasApprovalWork = input.waitingApprovalTasks > 0;
  const completionRate =
    input.totalTasks > 0
      ? Math.round((input.completedTasks / input.totalTasks) * 100)
      : 0;

  const urgency: AIAutonomousExecutionPriority =
    hasBlockedWork || input.priority === "critical"
      ? "critical"
      : hasApprovalWork || input.priority === "high"
        ? "high"
        : input.priority;

  const recommendedAction = hasBlockedWork
    ? "Resolve blocked autonomous execution tasks."
    : hasApprovalWork
      ? "Review pending approvals for autonomous execution."
      : input.executionStatus === "completed"
        ? "Review completed execution results."
        : "Continue monitoring autonomous execution progress.";

  return {
    linkTitle: `Command Center link for ${input.executionTitle}`,
    executionState: input.executionStatus,
    recommendedAction,
    urgency,
    summary: `${input.executionTitle} is ${completionRate}% complete with ${input.blockedTasks} blocked task(s) and ${input.waitingApprovalTasks} approval task(s).`,
  };
}