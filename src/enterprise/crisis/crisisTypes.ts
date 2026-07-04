export type CrisisSeverity = "low" | "medium" | "high" | "critical";

export type CrisisStatus =
  | "identified"
  | "assessing"
  | "active"
  | "contained"
  | "resolved"
  | "closed";

export type CrisisScope =
  | "team"
  | "department"
  | "organization"
  | "regional"
  | "global";

export type CrisisImpactArea =
  | "people"
  | "operations"
  | "customers"
  | "financial"
  | "legal"
  | "reputation"
  | "technology"
  | "security"
  | "compliance";

export type Crisis = {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  severity: CrisisSeverity;
  status: CrisisStatus;
  scope: CrisisScope;
  impactAreas: CrisisImpactArea[];
  detectedAt: string;
  declaredAt?: string;
  resolvedAt?: string;
  ownerId: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
};

export type CrisisAssessmentInput = {
  crisis: Crisis;
  affectedServices?: string[];
  affectedRegions?: string[];
  estimatedCustomerImpact?: number;
  estimatedFinancialImpact?: number;
  regulatoryExposure?: boolean;
  publicVisibility?: boolean;
};

export type CrisisAssessment = {
  crisisId: string;
  severity: CrisisSeverity;
  score: number;
  reasons: string[];
  requiresExecutiveAttention: boolean;
  requiresPublicCommunication: boolean;
};