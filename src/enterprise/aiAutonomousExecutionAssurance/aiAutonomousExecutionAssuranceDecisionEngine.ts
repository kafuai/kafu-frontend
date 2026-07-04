import {
  AIAutonomousExecutionAssuranceInput,
  AIAutonomousExecutionAssuranceLevel,
  AIAutonomousExecutionAssuranceResult,
  AIAutonomousExecutionAssuranceRisk,
  AIAutonomousExecutionAssuranceStatus,
} from "./aiAutonomousExecutionAssuranceTypes";
import {
  AIAutonomousExecutionAssurancePolicy,
  defaultExecutionAssurancePolicy,
  satisfiesExecutionAssurancePolicy,
} from "./aiAutonomousExecutionAssurancePolicy";
import { scoreExecutionAssurance } from "./aiAutonomousExecutionAssuranceScoring";

function resolveAssuranceLevel(
  score: number,
): AIAutonomousExecutionAssuranceLevel {
  if (score >= 0.95) return "enterprise";
  if (score >= 0.88) return "high";
  if (score >= 0.75) return "moderate";
  return "low";
}

function resolveAssuranceRisk(
  input: AIAutonomousExecutionAssuranceInput,
): AIAutonomousExecutionAssuranceRisk {
  if (input.riskScore >= 0.75) return "critical";
  if (input.riskScore >= 0.45) return "elevated";
  if (input.riskScore >= 0.2) return "manageable";
  return "minimal";
}

function resolveAssuranceStatus(
  score: number,
  policySatisfied: boolean,
  failedSignals: number,
): AIAutonomousExecutionAssuranceStatus {
  if (policySatisfied && score >= 0.9 && failedSignals === 0) {
    return "assured";
  }

  if (score >= 0.75 && failedSignals <= 2) {
    return "conditionally_assured";
  }

  return "not_assured";
}

function buildAssuranceBlockers(
  input: AIAutonomousExecutionAssuranceInput,
  policy: AIAutonomousExecutionAssurancePolicy,
): string[] {
  const blockers: string[] = [];

  if (!input.verificationPassed) {
    blockers.push("Execution verification did not pass.");
  }

  if (input.verificationScore < policy.minimumVerificationScore) {
    blockers.push("Verification score is below assurance policy threshold.");
  }

  if (input.riskScore > policy.maximumRiskScore) {
    blockers.push("Execution risk score exceeds assurance policy tolerance.");
  }

  if (
    input.operationalReadinessScore <
    policy.minimumOperationalReadiness
  ) {
    blockers.push("Operational readiness is below enterprise assurance threshold.");
  }

  if (input.auditCoverageScore < policy.minimumAuditCoverage) {
    blockers.push("Audit coverage is insufficient for enterprise assurance.");
  }

  input.signals
    .filter((signal) => !signal.passed)
    .forEach((signal) => {
      blockers.push(`Failed assurance signal: ${signal.label}`);
    });

  return blockers;
}

function buildAssuranceRecommendations(
  resultStatus: AIAutonomousExecutionAssuranceStatus,
  blockers: string[],
): string[] {
  if (resultStatus === "assured") {
    return [
      "Approve execution outcome for enterprise operational acceptance.",
      "Retain assurance evidence for audit and compliance review.",
    ];
  }

  if (resultStatus === "conditionally_assured") {
    return [
      "Proceed only with monitored rollout and explicit operational owner approval.",
      "Resolve remaining assurance gaps before broad autonomous execution scaling.",
      ...blockers.map((blocker) => `Address: ${blocker}`),
    ];
  }

  return [
    "Do not approve execution outcome for autonomous operational acceptance.",
    "Require remediation, re-verification, and renewed assurance evaluation.",
    ...blockers.map((blocker) => `Resolve: ${blocker}`),
  ];
}

export function evaluateExecutionAssurance(
  input: AIAutonomousExecutionAssuranceInput,
  policy: AIAutonomousExecutionAssurancePolicy =
    defaultExecutionAssurancePolicy,
): AIAutonomousExecutionAssuranceResult {
  const assuranceScore = scoreExecutionAssurance(input);
  const policySatisfied = satisfiesExecutionAssurancePolicy(input, policy);
  const passedSignals = input.signals.filter((signal) => signal.passed).length;
  const failedSignals = input.signals.length - passedSignals;
  const blockers = buildAssuranceBlockers(input, policy);
  const status = resolveAssuranceStatus(
    assuranceScore,
    policySatisfied,
    failedSignals,
  );

  return {
    executionId: input.executionId,
    tenantId: input.tenantId,
    status,
    level: resolveAssuranceLevel(assuranceScore),
    risk: resolveAssuranceRisk(input),
    assuranceScore,
    passedSignals,
    failedSignals,
    blockers,
    recommendations: buildAssuranceRecommendations(status, blockers),
    evaluatedAt: new Date().toISOString(),
  };
}