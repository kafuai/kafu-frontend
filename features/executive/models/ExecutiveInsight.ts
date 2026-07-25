export type ExecutiveInsightSource =
  | "opportunity-scoring"
  | "win-probability"
  | "revenue-prediction"
  | "pipeline-health"
  | "deal-risk"
  | "next-best-action"
  | "sales-forecast"
  | "revenue-orchestrator";

export interface ExecutiveInsight {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  recommendation: string;
  confidence: number;
  source: ExecutiveInsightSource;
  opportunityId?: string;
  createdAt: Date;
}
