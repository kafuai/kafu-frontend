export type EnterpriseRiskSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type EnterpriseRiskLikelihood =
  | "rare"
  | "unlikely"
  | "possible"
  | "likely"
  | "almostCertain";

export type EnterpriseRiskStatus =
  | "identified"
  | "assessed"
  | "accepted"
  | "mitigating"
  | "monitored"
  | "closed";

export type EnterpriseRiskCategory =
  | "strategic"
  | "operational"
  | "financial"
  | "compliance"
  | "technology"
  | "security"
  | "vendor"
  | "reputation"
  | "businessContinuity";

export interface EnterpriseRiskOwner {
  ownerId: string;
  name: string;
  role: string;
  department?: string;
}

export interface EnterpriseRisk {
  riskId: string;
  title: string;
  description: string;
  category: EnterpriseRiskCategory;
  severity: EnterpriseRiskSeverity;
  likelihood: EnterpriseRiskLikelihood;
  status: EnterpriseRiskStatus;
  owner: EnterpriseRiskOwner;
  identifiedAt: string;
  updatedAt: string;
  tags?: string[];
  relatedComplianceRequirementIds?: string[];
}