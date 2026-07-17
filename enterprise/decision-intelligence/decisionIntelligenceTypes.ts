export type EnterpriseDecisionPriority =
  | "critical"
  | "high"
  | "medium"
  | "low";

export type EnterpriseDecisionStatus =
  | "identified"
  | "recommended"
  | "approved"
  | "in-progress"
  | "completed"
  | "rejected";

export type EnterpriseDecisionConfidence =
  | "high"
  | "medium"
  | "low";

export type EnterpriseDecisionImpact =
  | "transformational"
  | "strategic"
  | "operational"
  | "limited";

export interface EnterpriseDecisionEvidence {
  id: string;
  title: string;
  description: string;
  source: string;
  reliabilityScore: number;
}

export interface EnterpriseDecisionRisk {
  id: string;
  title: string;
  description: string;
  severity: EnterpriseDecisionPriority;
  mitigation?: string | null;
}

export interface EnterpriseDecisionOption {
  id: string;
  title: string;
  description: string;
  expectedImpact: EnterpriseDecisionImpact;
  implementationEffort: EnterpriseDecisionPriority;
  estimatedValueScore: number;
  riskScore: number;
}

export interface EnterpriseDecisionRecommendation {
  decisionId: string;
  title: string;
  executiveSummary: string;
  recommendedOptionId: string;
  rationale: string;
  priority: EnterpriseDecisionPriority;
  confidence: EnterpriseDecisionConfidence;
  expectedImpact: EnterpriseDecisionImpact;
  recommendedOwner?: string | null;
  recommendedNextAction: string;
}

export interface EnterpriseDecisionRecord {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  businessArea: string;
  status: EnterpriseDecisionStatus;
  priority: EnterpriseDecisionPriority;
  confidence: EnterpriseDecisionConfidence;
  evidence: EnterpriseDecisionEvidence[];
  risks: EnterpriseDecisionRisk[];
  options: EnterpriseDecisionOption[];
  recommendation?: EnterpriseDecisionRecommendation | null;
  createdAt: string;
  updatedAt: string;
}
