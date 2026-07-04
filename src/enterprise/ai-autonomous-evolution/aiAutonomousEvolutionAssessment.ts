import { AIAutonomousEvolutionCandidate } from "./aiAutonomousEvolutionCandidate";
import { AIAutonomousEvolutionPolicy } from "./aiAutonomousEvolutionPolicy";
import { AIAutonomousEvolutionSignal } from "./aiAutonomousEvolutionSignal";
import {
  AIAutonomousEvolutionRiskLevel,
  AIAutonomousEvolutionScope,
} from "./aiAutonomousEvolutionTypes";

const riskWeight: Record<AIAutonomousEvolutionRiskLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export interface AIAutonomousEvolutionAssessment {
  candidateId: string;
  organizationId: string;
  scope: AIAutonomousEvolutionScope;
  eligible: boolean;
  riskLevel: AIAutonomousEvolutionRiskLevel;
  signalCoverage: number;
  averageSignalConfidence: number;
  policyCompliant: boolean;
  requiresHumanApproval: boolean;
  reasons: string[];
  assessedAt: Date;
}

export interface AssessAIAutonomousEvolutionInput {
  candidate: AIAutonomousEvolutionCandidate;
  policy: AIAutonomousEvolutionPolicy;
  signals: AIAutonomousEvolutionSignal[];
}

export function assessAIAutonomousEvolutionCandidate(
  input: AssessAIAutonomousEvolutionInput,
): AIAutonomousEvolutionAssessment {
  const relevantSignals = input.signals.filter((signal) =>
    input.candidate.requiredSignals.includes(signal.id),
  );

  const averageSignalConfidence =
    relevantSignals.length === 0
      ? 0
      : relevantSignals.reduce((total, signal) => total + signal.confidence, 0) /
        relevantSignals.length;

  const signalCoverage =
    input.candidate.requiredSignals.length === 0
      ? 1
      : relevantSignals.length / input.candidate.requiredSignals.length;

  const reasons: string[] = [];

  if (!input.policy.isEnabled) {
    reasons.push("Evolution policy is disabled.");
  }

  if (input.policy.blockedScopes.includes(input.candidate.scope)) {
    reasons.push(`Evolution scope is blocked: ${input.candidate.scope}.`);
  }

  if (
    input.policy.allowedScopes.length > 0 &&
    !input.policy.allowedScopes.includes(input.candidate.scope)
  ) {
    reasons.push(`Evolution scope is not allowed: ${input.candidate.scope}.`);
  }

  if (relevantSignals.length < input.policy.minimumRequiredSignals) {
    reasons.push(
      `Insufficient signals: ${relevantSignals.length}/${input.policy.minimumRequiredSignals}.`,
    );
  }

  if (averageSignalConfidence < input.policy.minimumSignalConfidence) {
    reasons.push(
      `Signal confidence below policy threshold: ${averageSignalConfidence.toFixed(2)} < ${input.policy.minimumSignalConfidence}.`,
    );
  }

  const riskLevel = determineAIAutonomousEvolutionRiskLevel(input.candidate, relevantSignals);

  if (riskWeight[riskLevel] > riskWeight[input.policy.maxAllowedRiskLevel]) {
    reasons.push(`Risk level exceeds policy maximum: ${riskLevel}.`);
  }

  const requiresHumanApproval =
    riskWeight[riskLevel] > riskWeight[input.policy.requiresHumanApprovalAboveRisk];

  const policyCompliant = reasons.length === 0;

  return {
    candidateId: input.candidate.id,
    organizationId: input.candidate.organizationId,
    scope: input.candidate.scope,
    eligible: policyCompliant,
    riskLevel,
    signalCoverage,
    averageSignalConfidence,
    policyCompliant,
    requiresHumanApproval,
    reasons,
    assessedAt: new Date(),
  };
}

export function determineAIAutonomousEvolutionRiskLevel(
  candidate: AIAutonomousEvolutionCandidate,
  signals: AIAutonomousEvolutionSignal[],
): AIAutonomousEvolutionRiskLevel {
  if (candidate.scope === "policy" || candidate.priority === "critical") {
    return "critical";
  }

  if (
    candidate.scope === "runtime_strategy" ||
    candidate.scope === "agent_behavior" ||
    candidate.priority === "high"
  ) {
    return "high";
  }

  const hasGovernanceOrSafetySignal = signals.some(
    (signal) => signal.type === "governance_constraint" || signal.type === "safety_constraint",
  );

  if (hasGovernanceOrSafetySignal) {
    return "high";
  }

  if (candidate.affectedCapabilities.length > 3 || candidate.priority === "medium") {
    return "medium";
  }

  return "low";
}