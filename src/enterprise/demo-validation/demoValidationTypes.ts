export type DemoValidationStatus =
  | "not-started"
  | "in-progress"
  | "ready"
  | "blocked"
  | "approved";

export type DemoValidationCategory =
  | "journey"
  | "presentation"
  | "navigation"
  | "data"
  | "performance"
  | "ui"
  | "business-value"
  | "executive-experience";

export type DemoValidationSeverity =
  | "critical"
  | "high"
  | "medium"
  | "low";

export type DemoValidationCheckStatus =
  | "pending"
  | "passed"
  | "failed"
  | "warning"
  | "not-applicable";

export interface DemoValidationCheck {
  id: string;
  title: string;
  description: string;
  category: DemoValidationCategory;
  severity: DemoValidationSeverity;
  status: DemoValidationCheckStatus;
  required: boolean;
  notes?: string[];
  validatedAt?: string;
}

export interface DemoValidationIssue {
  id: string;
  title: string;
  description: string;
  category: DemoValidationCategory;
  severity: DemoValidationSeverity;
  resolved: boolean;
  resolution?: string;
  relatedCheckId?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface DemoValidationScore {
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  warningChecks: number;
  pendingChecks: number;
  requiredChecks: number;
  passedRequiredChecks: number;
  unresolvedIssues: number;
  criticalIssues: number;
  scorePercentage: number;
  demoReady: boolean;
}

export interface DemoValidationReport {
  id: string;
  organizationId: string;
  companyName: string;
  title: string;
  status: DemoValidationStatus;
  checks: DemoValidationCheck[];
  issues: DemoValidationIssue[];
  score: DemoValidationScore;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
}

export interface DemoValidationReportInput {
  organizationId: string;
  companyName: string;
  title?: string;
  checks: DemoValidationCheck[];
  issues?: DemoValidationIssue[];
}
