import {
  ExecutiveApprovalCondition,
  ExecutiveApprovalRoutingStep,
  ExecutiveApprovalStatus,
} from "./executiveApprovalTypes";

export interface ExecutiveApprovalResult {
  organizationId: string;
  approvalRequestId: string;
  decisionId: string;

  approvalScore: number;
  confidenceScore: number;

  status: ExecutiveApprovalStatus;
  recommended: boolean;

  requiredApprovals: number;
  availableApprovers: number;

  routingSteps: ExecutiveApprovalRoutingStep[];

  satisfiedConditions: ExecutiveApprovalCondition[];
  unsatisfiedConditions: ExecutiveApprovalCondition[];
  blockingConditions: ExecutiveApprovalCondition[];

  executiveSummary: string;
  recommendedAction: string;

  evaluatedAt: string;
}

export interface CreateExecutiveApprovalResultInput {
  organizationId: string;
  approvalRequestId: string;
  decisionId: string;

  approvalScore: number;
  confidenceScore: number;

  status: ExecutiveApprovalStatus;
  recommended: boolean;

  requiredApprovals: number;
  availableApprovers: number;

  routingSteps?: ExecutiveApprovalRoutingStep[];

  satisfiedConditions?: ExecutiveApprovalCondition[];
  unsatisfiedConditions?: ExecutiveApprovalCondition[];
  blockingConditions?: ExecutiveApprovalCondition[];

  executiveSummary: string;
  recommendedAction: string;

  evaluatedAt: string;
}

export function createExecutiveApprovalResult(
  input: CreateExecutiveApprovalResultInput,
): ExecutiveApprovalResult {
  return {
    organizationId: input.organizationId,
    approvalRequestId: input.approvalRequestId,
    decisionId: input.decisionId,

    approvalScore: Math.max(
      0,
      Math.min(100, Math.round(input.approvalScore)),
    ),
    confidenceScore: Math.max(
      0,
      Math.min(100, Math.round(input.confidenceScore)),
    ),

    status: input.status,
    recommended: input.recommended,

    requiredApprovals: Math.max(
      0,
      Math.round(input.requiredApprovals),
    ),
    availableApprovers: Math.max(
      0,
      Math.round(input.availableApprovers),
    ),

    routingSteps: input.routingSteps ?? [],

    satisfiedConditions: input.satisfiedConditions ?? [],
    unsatisfiedConditions: input.unsatisfiedConditions ?? [],
    blockingConditions: input.blockingConditions ?? [],

    executiveSummary: input.executiveSummary,
    recommendedAction: input.recommendedAction,

    evaluatedAt: input.evaluatedAt,
  };
}
