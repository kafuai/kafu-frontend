export interface SupportAssignment {
  id: string;
  ticketId: string;
  agentId: string;
  assignedAt: Date;
  assignedBy: string;
}

export function createSupportAssignment(
  assignment: SupportAssignment,
): SupportAssignment {
  return assignment;
}
