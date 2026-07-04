import { AIAutonomousExecutionPolicy } from "./aiAutonomousExecutionPolicy";
import { evaluateAIAutonomousExecutionPolicy } from "./aiAutonomousExecutionPolicyEvaluator";
import { AIAutonomousExecutionTask } from "./aiAutonomousExecutionTask";
import { AIAutonomousExecutionDecision } from "./aiAutonomousExecutionTypes";

export interface AIAutonomousExecutionDecisionResult {
  taskId: string;
  decision: AIAutonomousExecutionDecision;
  requiresApproval: boolean;
  reasons: string[];
  decidedAt: Date;
}

export function decideAIAutonomousExecutionTask(
  task: AIAutonomousExecutionTask,
  policy: AIAutonomousExecutionPolicy,
): AIAutonomousExecutionDecisionResult {
  const evaluation = evaluateAIAutonomousExecutionPolicy(policy, task);

  if (!evaluation.allowed) {
    return {
      taskId: task.id,
      decision: "block",
      requiresApproval: false,
      reasons: evaluation.reasons,
      decidedAt: new Date(),
    };
  }

  if (task.approvalMode === "human_required" || evaluation.requiresApproval) {
    return {
      taskId: task.id,
      decision: "request_approval",
      requiresApproval: true,
      reasons: ["Approval required before autonomous execution."],
      decidedAt: new Date(),
    };
  }

  if (task.approvalMode === "none") {
    return {
      taskId: task.id,
      decision: "execute",
      requiresApproval: false,
      reasons: ["Task approved for autonomous execution."],
      decidedAt: new Date(),
    };
  }

  return {
    taskId: task.id,
    decision: policy.defaultApprovalMode === "none" ? "execute" : "request_approval",
    requiresApproval: policy.defaultApprovalMode !== "none",
    reasons: ["Policy default approval mode applied."],
    decidedAt: new Date(),
  };
}