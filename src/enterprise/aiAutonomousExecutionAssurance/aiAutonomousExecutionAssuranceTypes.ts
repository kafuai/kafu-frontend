export type AIAutonomousExecutionAssuranceLevel =
  | "low"
  | "moderate"
  | "high"
  | "enterprise";

export type AIAutonomousExecutionAssuranceStatus =
  | "assured"
  | "conditionally_assured"
  | "not_assured";

export type AIAutonomousExecutionAssuranceRisk =
  | "minimal"
  | "manageable"
  | "elevated"
  | "critical";

export type AIAutonomousExecutionAssuranceDomain =
  | "execution_integrity"
  | "verification_alignment"
  | "policy_conformance"
  | "risk_containment"
  | "operational_readiness"
  | "auditability";

export interface AIAutonomousExecutionAssuranceSignal {
  id: string;
  domain: AIAutonomousExecutionAssuranceDomain;
  label: string;
  confidence: number;
  weight: number;
  passed: boolean;
  notes?: string[];
}

export interface AIAutonomousExecutionAssuranceInput {
  executionId: string;
  tenantId: string;
  requestedBy: string;
  verificationScore: number;
  verificationPassed: boolean;
  riskScore: number;
  operationalReadinessScore: number;
  auditCoverageScore: number;
  signals: AIAutonomousExecutionAssuranceSignal[];
  createdAt: string;
}

export interface AIAutonomousExecutionAssuranceResult {
  executionId: string;
  tenantId: string;
  status: AIAutonomousExecutionAssuranceStatus;
  level: AIAutonomousExecutionAssuranceLevel;
  risk: AIAutonomousExecutionAssuranceRisk;
  assuranceScore: number;
  passedSignals: number;
  failedSignals: number;
  blockers: string[];
  recommendations: string[];
  evaluatedAt: string;
}