export type EnterpriseContextSource =
  | "knowledge_graph"
  | "organization_memory"
  | "executive_reasoning"
  | "executive_decision"
  | "recommendation_engine";

export type EnterpriseContextItem = {
  id: string;
  source: EnterpriseContextSource;
  title: string;
  summary: string;
  confidence: number;
  tags: string[];
};

export type EnterpriseContext = {
  organizationId: string;
  generatedAt: string;
  items: EnterpriseContextItem[];
};