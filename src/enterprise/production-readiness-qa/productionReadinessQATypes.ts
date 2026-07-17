export type ProductionReadinessQAStatus =
  | "not-started"
  | "in-progress"
  | "ready"
  | "blocked"
  | "approved";

export type ProductionReadinessQACategory =
  | "build"
  | "type-safety"
  | "routing"
  | "performance"
  | "security"
  | "accessibility"
  | "data-integrity"
  | "demo-readiness"
  | "deployment";

export type ProductionReadinessQASeverity =
  | "critical"
  | "high"
  | "medium"
  | "low";

export type ProductionReadinessQACheckStatus =
  | "pending"
  | "passed"
  | "failed"
  | "warning"
  | "not-applicable";

export interface ProductionReadinessQACheck {
  id: string;
  title: string;
  description: string;
  category: ProductionReadinessQACategory;
  severity: ProductionReadinessQASeverity;
  status: ProductionReadinessQACheckStatus;
  required: boolean;
  evidence?: string[];
  recommendation?: string;
  checkedAt?: string;
}

export interface ProductionReadinessQAIssue {
  id: string;
  title: string;
  description: string;
  category: ProductionReadinessQACategory;
  severity: ProductionReadinessQASeverity;
  resolved: boolean;
  resolution?: string;
  relatedCheckId?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface ProductionReadinessQAScore {
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
  productionReady: boolean;
}

export interface ProductionReadinessQAReport {
  id: string;
  organizationId: string;
  companyName: string;
  title: string;
  status: ProductionReadinessQAStatus;
  checks: ProductionReadinessQACheck[];
  issues: ProductionReadinessQAIssue[];
  score: ProductionReadinessQAScore;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
}

export interface ProductionReadinessQAReportInput {
  organizationId: string;
  companyName: string;
  title?: string;
  checks: ProductionReadinessQACheck[];
  issues?: ProductionReadinessQAIssue[];
}
