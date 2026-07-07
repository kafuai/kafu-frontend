import {
  AIAutonomousExecutionPriority,
  AIAutonomousExecutionStatus,
} from "../../enterprise/ai-autonomous-execution";

export interface ExecutiveWorkspaceExecutionSignalInput {
  organizationId: string;
  executiveWorkspaceId: string;
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

export interface ExecutiveWorkspaceExecutionSignalResult {
  signalTitle: string;
  executiveSummary: string;
  attentionLevel: AIAutonomousExecutionPriority;
  recommendedExecutiveAction: string;
  completionRate: number;
}

export function buildExecutiveWorkspaceExecutionSignal(
  input: ExecutiveWorkspaceExecutionSignalInput,
): ExecutiveWorkspaceExecutionSignalResult {
  const completionRate =
    input.totalTasks > 0
      ? Math.round((input.completedTasks / input.totalTasks) * 100)
      : 0;

  const attentionLevel: AIAutonomousExecutionPriority =
    input.blockedTasks > 0 || input.priority === "critical"
      ? "critical"
      : input.waitingApprovalTasks > 0 || input.priority === "high"
        ? "high"
        : input.priority;

  const recommendedExecutiveAction =
    input.blockedTasks > 0
      ? "Escalate blocked execution items and assign executive ownership."
      : input.waitingApprovalTasks > 0
        ? "Review pending approvals to maintain execution momentum."
        : input.executionStatus === "completed"
          ? "Review outcomes and capture executive lessons learned."
          : "Monitor execution progress and maintain strategic alignment.";

  return {
    signalTitle: `Executive signal for ${input.executionTitle}`,
    executiveSummary: `${input.executionTitle} is ${completionRate}% complete with ${input.blockedTasks} blocked task(s) and ${input.waitingApprovalTasks} approval task(s).`,
    attentionLevel,
    recommendedExecutiveAction,
    completionRate,
  };
}