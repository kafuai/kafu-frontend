import type {
  ExecutiveHealthStatus,
  ExecutiveKpiCategory,
  ExecutiveKpiPriority,
} from "./executiveKpiTypes";

export type ExecutiveDecisionType =
  | "strategic"
  | "revenue"
  | "sales"
  | "operational"
  | "risk";

export type ExecutiveDecisionStatus =
  | "proposed"
  | "approved"
  | "in_progress"
  | "completed"
  | "rejected";

export type ExecutiveDecisionUrgency =
  | "immediate"
  | "today"
  | "this_week"
  | "monitor";

export type ExecutiveDecisionConfidenceLevel =
  | "high"
  | "medium"
  | "low";

export interface ExecutiveDecisionEvidence {
  sourceType: "kpi" | "alert" | "briefing";
  sourceId: string;
  statement: string;
}

export interface ExecutiveDecisionImpact {
  revenue: number;
  sales: number;
  operations: number;
  strategic: number;
  overall: number;
  description: string;
}

export interface ExecutiveDecisionConfidence {
  score: number;
  level: ExecutiveDecisionConfidenceLevel;
  explanation: string;
}

export interface ExecutiveDecisionAction {
  id: string;
  title: string;
  description: string;
  sequence: number;
  required: boolean;
}

export interface ExecutiveDecisionRecommendation {
  id: string;
  type: ExecutiveDecisionType;
  category: ExecutiveKpiCategory;
  title: string;
  rationale: string;
  expectedOutcome: string;
  priority: ExecutiveKpiPriority;
  urgency: ExecutiveDecisionUrgency;
  healthStatus: ExecutiveHealthStatus;
  status: ExecutiveDecisionStatus;
  score: number;
  impact: ExecutiveDecisionImpact;
  confidence: ExecutiveDecisionConfidence;
  evidence: ExecutiveDecisionEvidence[];
  actions: ExecutiveDecisionAction[];
  sourceAlertId?: string;
  sourceKpiId?: string;
  generatedAt: string;
}

export interface ExecutiveDecisionSummary {
  total: number;
  immediate: number;
  today: number;
  thisWeek: number;
  monitor: number;
  critical: number;
  high: number;
  averageConfidence: number;
  averageImpact: number;
}

export interface ExecutiveDecisionSnapshot {
  generatedAt: string;
  organizationHealth: {
    score: number;
    status: ExecutiveHealthStatus;
  };
  recommendations: ExecutiveDecisionRecommendation[];
  summary: ExecutiveDecisionSummary;
  primaryRecommendation?: ExecutiveDecisionRecommendation;
}