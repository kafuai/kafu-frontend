import {
  AIExecutionComplianceControl,
  AIExecutionComplianceDomain,
  AIExecutionComplianceSeverity,
} from "./aiAutonomousExecutionComplianceTypes";

export interface AIExecutionCompliancePolicyConfig {
  policyId: string;
  name: string;
  version: string;
  controls: AIExecutionComplianceControl[];
}

export function createAIExecutionComplianceControl(
  id: string,
  domain: AIExecutionComplianceDomain,
  title: string,
  description: string,
  severity: AIExecutionComplianceSeverity,
  required = true
): AIExecutionComplianceControl {
  return {
    id,
    domain,
    title,
    description,
    severity,
    required,
  };
}

export function createDefaultAIExecutionCompliancePolicy(): AIExecutionCompliancePolicyConfig {
  return {
    policyId: "kafu-ai-autonomous-execution-compliance-policy",
    name: "KAFU AI Autonomous Execution Compliance Policy",
    version: "1.0.0",
    controls: [
      createAIExecutionComplianceControl(
        "policy-intent-alignment",
        "policy",
        "Execution Intent Alignment",
        "Execution must remain aligned with approved business and AI operating policies.",
        "high"
      ),
      createAIExecutionComplianceControl(
        "privacy-data-minimization",
        "privacy",
        "Data Minimization",
        "Execution must only use data required for the approved autonomous operation.",
        "critical"
      ),
      createAIExecutionComplianceControl(
        "security-boundary-respect",
        "security",
        "Security Boundary Respect",
        "Execution must not exceed authorized system, tenant, or workflow boundaries.",
        "critical"
      ),
      createAIExecutionComplianceControl(
        "audit-traceability",
        "audit",
        "Audit Traceability",
        "Execution must produce enough evidence for enterprise audit review.",
        "high"
      ),
      createAIExecutionComplianceControl(
        "risk-escalation-readiness",
        "risk",
        "Risk Escalation Readiness",
        "High-risk execution must be detectable and ready for escalation.",
        "high"
      ),
      createAIExecutionComplianceControl(
        "governance-accountability",
        "governance",
        "Governance Accountability",
        "Execution must preserve accountability metadata for autonomous decisions.",
        "medium"
      ),
    ],
  };
}