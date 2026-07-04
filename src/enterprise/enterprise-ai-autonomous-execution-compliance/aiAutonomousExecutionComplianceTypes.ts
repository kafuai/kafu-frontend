export type AIExecutionComplianceSeverity =
  | "info"
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AIExecutionComplianceStatus =
  | "compliant"
  | "warning"
  | "violation"
  | "blocked";

export type AIExecutionComplianceDomain =
  | "policy"
  | "privacy"
  | "security"
  | "audit"
  | "risk"
  | "governance";

export interface AIExecutionComplianceControl {
  id: string;
  domain: AIExecutionComplianceDomain;
  title: string;
  description: string;
  severity: AIExecutionComplianceSeverity;
  required: boolean;
}

export interface AIExecutionComplianceEvidence {
  controlId: string;
  source: string;
  summary: string;
  confidence: number;
  collectedAt: string;
}

export interface AIExecutionComplianceFinding {
  controlId: string;
  status: AIExecutionComplianceStatus;
  severity: AIExecutionComplianceSeverity;
  message: string;
  remediation?: string;
}

export interface AIExecutionComplianceAssessment {
  assessmentId: string;
  executionId: string;
  status: AIExecutionComplianceStatus;
  score: number;
  findings: AIExecutionComplianceFinding[];
  evidence: AIExecutionComplianceEvidence[];
  assessedAt: string;
}