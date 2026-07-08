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

export interface ExecutiveDemoExperienceSignal {
  companyName: string;
  companyHealthScore: number;
  strategicExecutionScore: number;
  financialPerformanceScore: number;
  workforceStabilityScore: number;
  payrollReadinessScore: number;
  criticalAlerts: string[];
  aiBriefing: string;
  recommendedExecutiveActions: string[];
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

export function buildExecutiveDemoExperienceSignal(): ExecutiveDemoExperienceSignal {
  return {
    companyName: "Nexa Holdings",
    companyHealthScore: 82,
    strategicExecutionScore: 76,
    financialPerformanceScore: 88,
    workforceStabilityScore: 74,
    payrollReadinessScore: 87,
    criticalAlerts: [
      "18 payroll exceptions remain unresolved before month-end closure.",
      "7 strategic projects are delayed and require executive review.",
      "Workforce stability is below target in selected departments.",
    ],
    aiBriefing:
      "KAFU AI analyzed Finance, HR, Operations, Strategy, and Workforce signals. The company is financially healthy, but payroll readiness, execution delays, and workforce stability require executive attention before month-end closure.",
    recommendedExecutiveActions: [
      "Review payroll exceptions with HR and Finance before payroll export.",
      "Run an executive review for delayed transformation initiatives.",
      "Prioritize manager follow-up for departments with elevated workforce risk.",
    ],
  };
}
