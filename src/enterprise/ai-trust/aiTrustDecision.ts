import { AITrustLevel } from "./aiTrustTypes";

export type AITrustDecisionOutcome =
  | "approved"
  | "approved_with_controls"
  | "requires_review"
  | "rejected";

export interface AITrustDecision {
  id: string;
  profileId: string;
  outcome: AITrustDecisionOutcome;
  trustScore: number;
  trustLevel: AITrustLevel;
  rationale: string[];
  controls: string[];
  decidedAt: Date;
}

export function createAITrustDecision(
  id: string,
  profileId: string,
  trustScore: number,
  trustLevel: AITrustLevel,
  failedSignalsCount: number,
): AITrustDecision {
  const rationale: string[] = [];
  const controls: string[] = [];

  let outcome: AITrustDecisionOutcome = "requires_review";

  if (trustScore >= 85 && failedSignalsCount === 0) {
    outcome = "approved";
    rationale.push("Trust score is strong and no failed signals were detected.");
  } else if (trustScore >= 70) {
    outcome = "approved_with_controls";
    rationale.push("Trust score is acceptable but additional controls are required.");
    controls.push("Enable continuous trust monitoring.");
  } else if (trustScore >= 50) {
    outcome = "requires_review";
    rationale.push("Trust score is moderate and requires human review.");
    controls.push("Require human approval before production use.");
  } else {
    outcome = "rejected";
    rationale.push("Trust score is below acceptable threshold.");
    controls.push("Block deployment until remediation is completed.");
  }

  return {
    id,
    profileId,
    outcome,
    trustScore,
    trustLevel,
    rationale,
    controls,
    decidedAt: new Date(),
  };
}