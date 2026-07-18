export type ExecutiveDecisionBriefingStatus =
  | "draft"
  | "in-review"
  | "ready"
  | "approved"
  | "deferred"
  | "rejected";

export type ExecutiveDecisionBriefingPriority =
  | "critical"
  | "high"
  | "medium"
  | "low";

export type ExecutiveDecisionBriefingConfidence =
  | "very-high"
  | "high"
  | "medium"
  | "low";

export interface ExecutiveDecisionBriefingMetric {
  id: string;
  label: string;
  value: string;
  description?: string;
  trend?: "improving" | "stable" | "declining";
}

export interface ExecutiveDecisionBriefingEvidence {
  id: string;
  title: string;
  summary: string;
  source?: string;
  confidence?: ExecutiveDecisionBriefingConfidence;
}

export interface ExecutiveDecisionBriefingRisk {
  id: string;
  title: string;
  description: string;
  severity: ExecutiveDecisionBriefingPriority;
  mitigation?: string;
}

export interface ExecutiveDecisionBriefingAction {
  id: string;
  title: string;
  description: string;
  owner: string;
  priority: ExecutiveDecisionBriefingPriority;
  dueDate?: string;
  status?: "pending" | "in-progress" | "completed";
}

export interface ExecutiveDecisionBriefingOption {
  id: string;
  title: string;
  summary: string;
  advantages: string[];
  tradeoffs: string[];
  estimatedImpact: string;
  recommended: boolean;
}

export interface ExecutiveDecisionBriefing {
  id: string;
  organizationId: string;
  companyName: string;
  title: string;
  executiveSummary: string;
  decisionRequired: string;
  recommendedDecision: string;
  rationale: string;
  status: ExecutiveDecisionBriefingStatus;
  priority: ExecutiveDecisionBriefingPriority;
  confidence: ExecutiveDecisionBriefingConfidence;
  impactAreas: string[];
  keyMetrics: ExecutiveDecisionBriefingMetric[];
  evidence: ExecutiveDecisionBriefingEvidence[];
  risks: ExecutiveDecisionBriefingRisk[];
  actions: ExecutiveDecisionBriefingAction[];
  options: ExecutiveDecisionBriefingOption[];
  createdAt: string;
  updatedAt: string;
  readyAt?: string;
  approvedAt?: string;
}

export interface CreateExecutiveDecisionBriefingInput {
  organizationId: string;
  companyName: string;
  title: string;
  executiveSummary: string;
  decisionRequired: string;
  recommendedDecision: string;
  rationale: string;
  priority: ExecutiveDecisionBriefingPriority;
  confidence: ExecutiveDecisionBriefingConfidence;
  impactAreas: string[];
  keyMetrics?: ExecutiveDecisionBriefingMetric[];
  evidence?: ExecutiveDecisionBriefingEvidence[];
  risks?: ExecutiveDecisionBriefingRisk[];
  actions?: ExecutiveDecisionBriefingAction[];
  options?: ExecutiveDecisionBriefingOption[];
}
