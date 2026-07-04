export type AIExecutionVerificationStatus =
  | "verified"
  | "partially_verified"
  | "unverified"
  | "inconclusive";

export type AIExecutionVerificationSeverity =
  | "info"
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AIExecutionVerificationEvidenceType =
  | "validation_result"
  | "execution_trace"
  | "policy_check"
  | "audit_record"
  | "system_signal"
  | "human_review";

export interface AIExecutionVerificationEvidence {
  id: string;
  type: AIExecutionVerificationEvidenceType;
  source: string;
  confidence: number;
  weight: number;
  observedAt: string;
  summary: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface AIExecutionVerificationFinding {
  id: string;
  severity: AIExecutionVerificationSeverity;
  title: string;
  description: string;
  evidenceIds: string[];
  isBlocking: boolean;
}

export interface AIExecutionVerificationInput {
  executionId: string;
  validationId: string;
  requestedBy: string;
  requestedAt: string;
  evidence: AIExecutionVerificationEvidence[];
  findings?: AIExecutionVerificationFinding[];
}

export interface AIExecutionVerificationResult {
  executionId: string;
  validationId: string;
  status: AIExecutionVerificationStatus;
  score: number;
  confidence: number;
  verifiedEvidenceCount: number;
  blockingFindingCount: number;
  generatedAt: string;
}