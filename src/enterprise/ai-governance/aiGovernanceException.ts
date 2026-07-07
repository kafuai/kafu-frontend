export interface AIGovernanceException {
  id: string;
  policyId: string;
  reason: string;
  requestedBy: string;
  approvedBy?: string;
  createdAt: string;
  expiresAt?: string;
  status: "pending" | "approved" | "rejected" | "expired";
}

export function isGovernanceExceptionActive(
  exception: AIGovernanceException,
  now = new Date(),
): boolean {
  if (exception.status !== "approved") {
    return false;
  }

  if (!exception.expiresAt) {
    return true;
  }

  return new Date(exception.expiresAt).getTime() > now.getTime();
}
