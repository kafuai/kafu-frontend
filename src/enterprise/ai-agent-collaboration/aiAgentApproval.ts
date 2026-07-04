export type AIAgentApprovalStatus = "pending" | "approved" | "rejected";

export interface AIAgentApproval {
  id: string;
  approverAgentId: string;
  targetId: string;
  status: AIAgentApprovalStatus;
  reason: string;
  createdAt: Date;
  decidedAt?: Date;
}

export function createAIAgentApproval(approval: AIAgentApproval): AIAgentApproval {
  if (!approval.id.trim()) throw new Error("Approval id is required");
  if (!approval.approverAgentId.trim()) throw new Error("Approver agent id is required");
  if (!approval.targetId.trim()) throw new Error("Approval target id is required");

  return approval;
}

export function approveAIAgentApproval(
  approval: AIAgentApproval,
  reason: string,
): AIAgentApproval {
  return { ...approval, status: "approved", reason, decidedAt: new Date() };
}

export function rejectAIAgentApproval(
  approval: AIAgentApproval,
  reason: string,
): AIAgentApproval {
  return { ...approval, status: "rejected", reason, decidedAt: new Date() };
}