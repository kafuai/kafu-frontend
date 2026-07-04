import { AIGovernanceRiskLevel } from "./aiGovernanceTypes";

export interface AIComplianceReadinessInput {
  riskLevel: AIGovernanceRiskLevel;
  hasPolicy: boolean;
  hasAuditTrail: boolean;
  hasExplainability: boolean;
  hasHumanOversight: boolean;
  hasModelOwner: boolean;
  hasMonitoring: boolean;
}

export interface AIComplianceReadinessResult {
  score: number;
  status: "ready" | "partially_ready" | "not_ready";
  gaps: string[];
  recommendations: string[];
}

export function assessAIComplianceReadiness(
  input: AIComplianceReadinessInput,
): AIComplianceReadinessResult {
  const gaps: string[] = [];
  const recommendations: string[] = [];

  if (!input.hasPolicy) {
    gaps.push("AI governance policy is missing.");
    recommendations.push("Create and activate an AI governance policy.");
  }

  if (!input.hasAuditTrail) {
    gaps.push("Audit trail is missing.");
    recommendations.push("Enable immutable AI decision audit logging.");
  }

  if (!input.hasExplainability && input.riskLevel !== "low") {
    gaps.push("Explainability artifacts are missing.");
    recommendations.push("Attach explainability evidence for medium and higher risk AI use cases.");
  }

  if (!input.hasHumanOversight && (input.riskLevel === "high" || input.riskLevel === "critical")) {
    gaps.push("Human oversight is missing.");
    recommendations.push("Require human review or approval for high-risk AI use cases.");
  }

  if (!input.hasModelOwner) {
    gaps.push("Model owner is missing.");
    recommendations.push("Assign an accountable model owner or owner team.");
  }

  if (!input.hasMonitoring) {
    gaps.push("AI monitoring is missing.");
    recommendations.push("Enable ongoing model and use-case monitoring.");
  }

  const totalControls = 6;
  const score = Math.round(((totalControls - gaps.length) / totalControls) * 100);

  return {
    score,
    status: score >= 85 ? "ready" : score >= 60 ? "partially_ready" : "not_ready",
    gaps,
    recommendations,
  };
}