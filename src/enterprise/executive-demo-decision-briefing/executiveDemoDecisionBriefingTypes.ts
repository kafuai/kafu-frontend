export type ExecutiveDecisionBriefingPriority =
  | "critical"
  | "high"
  | "medium"
  | "low";

export type ExecutiveDecisionBriefingConfidence =
  | "very-high"
  | "high"
  | "moderate"
  | "low";

export type ExecutiveDecisionBriefingStatus =
  | "draft"
  | "ready"
  | "presented"
  | "approved"
  | "deferred";

export type ExecutiveDecisionBriefingImpactArea =
  | "revenue"
  | "cost"
  | "risk"
  | "operations"
  | "customer"
  | "workforce"
  | "governance"
  | "technology";

export interface ExecutiveDecisionBriefingMetric {
  id: string;
  label: string;
  value: string;
  description?: string;
  trend?: "positive" | "negative" | "stable";
}

export interface ExecutiveDecisionBriefingEvidence {
  id: string;
  title: string;
  summary: string;
  source?: string;
  strength: ExecutiveDecisionBriefingConfidence;
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
  owner?: string;
  targetDate?: string;
  priority: ExecutiveDecisionBriefingPriority;
}

export interface ExecutiveDecisionBriefingOption {
  id: string;
  title: string;
  summary: string;
  advantages: string[];
  tradeoffs: string[];
  estimatedImpact?: string;
  recommended?: boolean;
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
  priority: ExecutiveDecisionBriefingPriority;
  confidence: ExecutiveDecisionBriefingConfidence;
  status: ExecutiveDecisionBriefingStatus;
  impactAreas: ExecutiveDecisionBriefingImpactArea[];
  keyMetrics: ExecutiveDecisionBriefingMetric[];
  evidence: ExecutiveDecisionBriefingEvidence[];
  risks: ExecutiveDecisionBriefingRisk[];
  actions: ExecutiveDecisionBriefingAction[];
  options: ExecutiveDecisionBriefingOption[];
  createdAt: string;
  updatedAt: string;
  presentationDate?: string;
}

export interface ExecutiveDecisionBriefingInput {
  organizationId: string;
  companyName: string;
  title: string;
  executiveSummary: string;
  decisionRequired: string;
  recommendedDecision: string;
  rationale: string;
  priority?: ExecutiveDecisionBriefingPriority;
  confidence?: ExecutiveDecisionBriefingConfidence;
  impactAreas?: ExecutiveDecisionBriefingImpactArea[];
  keyMetrics?: ExecutiveDecisionBriefingMetric[];
  evidence?: ExecutiveDecisionBriefingEvidence[];
  risks?: ExecutiveDecisionBriefingRisk[];
  actions?: ExecutiveDecisionBriefingAction[];
  options?: ExecutiveDecisionBriefingOption[];
}
