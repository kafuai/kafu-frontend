import {
  AIExecutionComplianceAssessment,
  AIExecutionComplianceEvidence,
  AIExecutionComplianceFinding,
  AIExecutionComplianceStatus,
} from "./aiAutonomousExecutionComplianceTypes";
import { AIExecutionCompliancePolicyConfig } from "./aiExecutionCompliancePolicy";
import { hasSufficientComplianceEvidence } from "./aiExecutionComplianceEvidence";

export interface AIExecutionComplianceEvaluationInput {
  executionId: string;
  policy: AIExecutionCompliancePolicyConfig;
  evidence: AIExecutionComplianceEvidence[];
}

export function evaluateAIExecutionCompliance(
  input: AIExecutionComplianceEvaluationInput
): AIExecutionComplianceAssessment {
  const findings: AIExecutionComplianceFinding[] = [];

  for (const control of input.policy.controls) {
    const satisfied = hasSufficientComplianceEvidence(
      input.evidence,
      control.id
    );

    findings.push({
      controlId: control.id,
      severity: control.severity,
      status: satisfied
        ? "compliant"
        : control.required
        ? "violation"
        : "warning",
      message: satisfied
        ? "Compliance control satisfied."
        : "Compliance evidence is missing.",
      remediation: satisfied
        ? undefined
        : "Collect additional compliance evidence before execution approval.",
    });
  }

  const violations = findings.filter(
    (f) => f.status === "violation"
  ).length;

  const warnings = findings.filter(
    (f) => f.status === "warning"
  ).length;

  const score =
    findings.length === 0
      ? 100
      : Math.round(
          ((findings.length - violations - warnings * 0.5) /
            findings.length) *
            100
        );

  let status: AIExecutionComplianceStatus = "compliant";

  if (violations > 0) {
    status = "blocked";
  } else if (warnings > 0) {
    status = "warning";
  }

  return {
    assessmentId: `compliance-${Date.now()}`,
    executionId: input.executionId,
    status,
    score: Math.max(0, score),
    findings,
    evidence: input.evidence,
    assessedAt: new Date().toISOString(),
  };
}