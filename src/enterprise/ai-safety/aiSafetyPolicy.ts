import { AISafetyDomain, AISafetyRiskLevel } from "./aiSafetyTypes";

export interface AISafetyPolicyRule {
  id: string;
  domain: AISafetyDomain;
  maxAllowedRiskLevel: AISafetyRiskLevel;
  blockOnCritical: boolean;
  requireReviewOnHigh: boolean;
  description: string;
}

export interface AISafetyPolicy {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  enabled: boolean;
  rules: AISafetyPolicyRule[];
  createdAt: Date;
  updatedAt: Date;
}

export function createDefaultAISafetyPolicy(
  organizationId: string,
): AISafetyPolicy {
  const now = new Date();

  return {
    id: `${organizationId}-default-ai-safety-policy`,
    organizationId,
    name: "Default Enterprise AI Safety Policy",
    description:
      "Default enterprise policy for classifying, reviewing, and blocking unsafe AI behavior.",
    enabled: true,
    createdAt: now,
    updatedAt: now,
    rules: [
      {
        id: "harmful-content-critical-block",
        domain: AISafetyDomain.HARMFUL_CONTENT,
        maxAllowedRiskLevel: AISafetyRiskLevel.MEDIUM,
        blockOnCritical: true,
        requireReviewOnHigh: true,
        description:
          "Blocks critical harmful content and requires review for high-risk harmful outputs.",
      },
      {
        id: "privacy-data-leakage-block",
        domain: AISafetyDomain.DATA_LEAKAGE,
        maxAllowedRiskLevel: AISafetyRiskLevel.LOW,
        blockOnCritical: true,
        requireReviewOnHigh: true,
        description:
          "Prevents sensitive or confidential data leakage through AI inputs or outputs.",
      },
      {
        id: "security-high-review",
        domain: AISafetyDomain.SECURITY,
        maxAllowedRiskLevel: AISafetyRiskLevel.MEDIUM,
        blockOnCritical: true,
        requireReviewOnHigh: true,
        description:
          "Controls security-sensitive AI behavior and escalates high-risk security findings.",
      },
    ],
  };
}