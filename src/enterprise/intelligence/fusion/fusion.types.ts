export interface FusionContext {
  organizationId: string;
  depth: "low" | "medium" | "high";
}

export interface UnifiedInsight {
  id: string;
  organizationId: string;

  summary: string;
  insights: string[];

  riskLevel: "low" | "medium" | "high";
  confidence: number;

  createdAt: number;
}