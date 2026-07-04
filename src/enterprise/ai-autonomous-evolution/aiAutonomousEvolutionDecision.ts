import { AIAutonomousEvolutionAssessment } from "./aiAutonomousEvolutionAssessment";
import { AIAutonomousEvolutionCandidate } from "./aiAutonomousEvolutionCandidate";
import {
  AIAutonomousEvolutionDecisionType,
  AIAutonomousEvolutionRiskLevel,
} from "./aiAutonomousEvolutionTypes";

export interface AIAutonomousEvolutionDecision {
  id: string;
  candidateId: string;
  organizationId: string;
  type: AIAutonomousEvolutionDecisionType;
  riskLevel: AIAutonomousEvolutionRiskLevel;
  rationale: string;
  decidedBy: string;
  decidedAt: Date;
}

export interface CreateAIAutonomousEvolutionDecisionInput {
  id: string;
  candidate: AIAutonomousEvolutionCandidate;
  assessment: AIAutonomousEvolutionAssessment;
  decidedBy?: string;
}

export function createAIAutonomousEvolutionDecision(
  input: CreateAIAutonomousEvolutionDecisionInput,
): AIAutonomousEvolutionDecision {
  const type = determineAIAutonomousEvolutionDecisionType(input.assessment);

  return {
    id: input.id,
    candidateId: input.candidate.id,
    organizationId: input.candidate.organizationId,
    type,
    riskLevel: input.assessment.riskLevel,
    rationale: buildAIAutonomousEvolutionDecisionRationale(input.assessment, type),
    decidedBy: input.decidedBy ?? "ai-autonomous-evolution",
    decidedAt: new Date(),
  };
}

export function determineAIAutonomousEvolutionDecisionType(
  assessment: AIAutonomousEvolutionAssessment,
): AIAutonomousEvolutionDecisionType {
  if (!assessment.policyCompliant) {
    return "reject";
  }

  if (assessment.requiresHumanApproval) {
    return "require_human_review";
  }

  return "approve";
}

export function buildAIAutonomousEvolutionDecisionRationale(
  assessment: AIAutonomousEvolutionAssessment,
  type: AIAutonomousEvolutionDecisionType,
): string {
  if (type === "reject") {
    return assessment.reasons.length > 0
      ? assessment.reasons.join(" ")
      : "Candidate rejected by autonomous evolution policy.";
  }

  if (type === "require_human_review") {
    return `Candidate requires human approval due to ${assessment.riskLevel} risk.`;
  }

  if (type === "defer") {
    return "Candidate deferred for additional evidence.";
  }

  return "Candidate approved by autonomous evolution policy.";
}