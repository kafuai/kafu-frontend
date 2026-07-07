export interface AIGovernanceEvidence {
  id: string;
  source: string;
  type: "document" | "log" | "audit" | "approval" | "metric";
  reference: string;
  collectedAt: string;
  verified: boolean;
}

export function filterVerifiedGovernanceEvidence(
  evidence: AIGovernanceEvidence[],
): AIGovernanceEvidence[] {
  return evidence.filter((item) => item.verified);
}
