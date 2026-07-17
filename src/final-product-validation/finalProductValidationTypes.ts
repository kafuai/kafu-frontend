export type FinalProductValidationCategory =
  | "engineering"
  | "architecture"
  | "product"
  | "experience"
  | "security"
  | "operations"
  | "commercial"
  | "go-to-market";

export type FinalProductValidationSeverity =
  | "critical"
  | "high"
  | "medium"
  | "low";

export type FinalProductValidationStatus =
  | "passed"
  | "failed"
  | "pending"
  | "not-applicable";

export type FinalProductReleaseDecision =
  | "ready-for-production"
  | "ready-for-pilot"
  | "conditionally-ready"
  | "hold-release";

export interface FinalProductValidationRequirement {
  id: string;
  title: string;
  description: string;
  category: FinalProductValidationCategory;
  severity: FinalProductValidationSeverity;
  required: boolean;
  minimumScore?: number;
}

export interface FinalProductValidationEvidence {
  requirementId: string;
  status: FinalProductValidationStatus;
  score?: number;
  evidence?: string;
  notes?: string;
  validatedAt?: string;
}

export interface FinalProductValidationFinding {
  requirementId: string;
  title: string;
  category: FinalProductValidationCategory;
  severity: FinalProductValidationSeverity;
  status: FinalProductValidationStatus;
  blocking: boolean;
  score: number;
  evidence?: string;
  notes?: string;
}

export interface FinalProductCategoryResult {
  category: FinalProductValidationCategory;
  score: number;
  passed: number;
  failed: number;
  pending: number;
  total: number;
  blockingIssues: number;
}

export interface FinalProductValidationSummary {
  overallScore: number;
  totalRequirements: number;
  passedRequirements: number;
  failedRequirements: number;
  pendingRequirements: number;
  blockingIssues: number;
  decision: FinalProductReleaseDecision;
}

export interface FinalProductValidationResult {
  productName: string;
  version: string;
  evaluatedAt: string;
  summary: FinalProductValidationSummary;
  categoryResults: FinalProductCategoryResult[];
  findings: FinalProductValidationFinding[];
  blockers: FinalProductValidationFinding[];
  recommendations: string[];
}
