import {
  AIExecutionGovernanceDecision,
  AIExecutionGovernanceResult,
} from "./aiExecutionGovernanceTypes";

export type AIExecutionGovernanceStatus =
  | "governed"
  | "blocked"
  | "pending_review"
  | "conditional";

export function resolveAIExecutionGovernanceStatus(
  result: AIExecutionGovernanceResult
): AIExecutionGovernanceStatus {
  const statusByDecision: Record<
    AIExecutionGovernanceDecision,
    AIExecutionGovernanceStatus
  > = {
    approved: "governed",
    conditionally_approved: "conditional",
    rejected: "blocked",
    requires_review: "pending_review",
  };

  return statusByDecision[result.decision];
}

export function isAIExecutionGovernanceBlocking(
  result: AIExecutionGovernanceResult
): boolean {
  return resolveAIExecutionGovernanceStatus(result) === "blocked";
}