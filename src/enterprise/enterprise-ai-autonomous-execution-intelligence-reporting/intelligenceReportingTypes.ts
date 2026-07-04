export type IntelligenceReportSeverity = "low" | "medium" | "high" | "critical";

export type IntelligenceReportStatus =
  | "healthy"
  | "watch"
  | "attention_required"
  | "at_risk"
  | "critical";

export type IntelligenceReportAudience =
  | "executive"
  | "operations"
  | "product"
  | "engineering"
  | "compliance"
  | "customer_success";

export interface IntelligenceReportingSignal {
  id: string;
  title: string;
  description: string;
  severity: IntelligenceReportSeverity;
  confidence: number;
  source: string;
  timestamp: string;
  tags: string[];
}

export interface IntelligenceReportingMetric {
  name: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "flat";
  impact: IntelligenceReportSeverity;
}

export interface IntelligenceReportingRecommendation {
  id: string;
  title: string;
  rationale: string;
  priority: IntelligenceReportSeverity;
  expectedOutcome: string;
  ownerHint?: string;
}

export interface IntelligenceExecutionReportInput {
  executionId: string;
  tenantId: string;
  generatedAt: string;
  audience: IntelligenceReportAudience;
  signals: IntelligenceReportingSignal[];
  metrics: IntelligenceReportingMetric[];
}

export interface IntelligenceExecutionReport {
  reportId: string;
  executionId: string;
  tenantId: string;
  generatedAt: string;
  audience: IntelligenceReportAudience;
  status: IntelligenceReportStatus;
  severity: IntelligenceReportSeverity;
  executiveSummary: string;
  keyFindings: string[];
  metrics: IntelligenceReportingMetric[];
  recommendations: IntelligenceReportingRecommendation[];
  confidenceScore: number;
}