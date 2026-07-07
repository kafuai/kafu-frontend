export type StrategicSignalType =
  | "market"
  | "customer"
  | "competitor"
  | "technology"
  | "financial"
  | "regulatory"
  | "internal";

export type StrategicPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type StrategicRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface StrategicSignal {
  id: string;
  type: StrategicSignalType;
  title: string;
  description: string;
  priority: StrategicPriority;
  confidence: number;
  impact: number;
}

export interface StrategicInsight {
  id: string;
  title: string;
  summary: string;
  confidence: number;
  generatedAt: Date;
}

export interface StrategicRecommendation {
  id: string;
  title: string;
  description: string;
  expectedImpact: number;
  riskLevel: StrategicRiskLevel;
}

export interface StrategicReport {
  organizationId: string;
  insights: StrategicInsight[];
  recommendations: StrategicRecommendation[];
  generatedAt: Date;
}