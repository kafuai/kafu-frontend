import { ExecutiveApprovalContext } from "./executiveApprovalContext";
import {
  ExecutiveApprovalLevel,
  ExecutiveApprovalRoutingStep,
} from "./executiveApprovalTypes";

const approvalLevelOrder: ExecutiveApprovalLevel[] = [
  "manager",
  "director",
  "executive",
  "committee",
  "board",
];

function determineRequiredLevels(
  context: ExecutiveApprovalContext,
): ExecutiveApprovalLevel[] {
  const levels = new Set<ExecutiveApprovalLevel>();

  if (
    context.priority === "low" &&
    context.riskLevel === "minimal"
  ) {
    levels.add("manager");
  } else if (
    context.priority === "medium" ||
    context.riskLevel === "moderate"
  ) {
    levels.add("director");
  } else {
    levels.add("executive");
  }

  if (
    context.priority === "critical" ||
    context.riskLevel === "severe"
  ) {
    levels.add("executive");
  }

  if (context.requiresCommitteeApproval) {
    levels.add("committee");
  }

  if (context.requiresBoardApproval) {
    levels.add("board");
  }

  return approvalLevelOrder.filter((level) =>
    levels.has(level),
  );
}

export function buildExecutiveApprovalRouting(
  context: ExecutiveApprovalContext,
): ExecutiveApprovalRoutingStep[] {
  const requiredLevels =
    determineRequiredLevels(context);

  return requiredLevels.map((approvalLevel, index) => {
    const matchingApprovers = context.approvers.filter(
      (approver) =>
        approver.approvalLevel === approvalLevel &&
        approver.available,
    );

    const mandatoryApprovers = matchingApprovers.filter(
      (approver) => approver.mandatory,
    );

    const requiredApprovals =
      mandatoryApprovers.length > 0
        ? mandatoryApprovers.length
        : matchingApprovers.length > 0
          ? 1
          : 0;

    return {
      sequence: index + 1,
      approvalLevel,
      approverIds: matchingApprovers.map(
        (approver) => approver.approverId,
      ),
      requiredApprovals,
      parallel:
        approvalLevel === "committee" ||
        approvalLevel === "board",
    };
  });
}

export function calculateRequiredApprovalCount(
  routingSteps: ExecutiveApprovalRoutingStep[],
): number {
  return routingSteps.reduce(
    (total, step) => total + step.requiredApprovals,
    0,
  );
}
