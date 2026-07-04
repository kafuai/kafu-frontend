export type KnowledgeNodeType =
  | "organization"
  | "department"
  | "capability"
  | "process"
  | "risk"
  | "opportunity"
  | "decision"
  | "recommendation"
  | "metric"
  | "policy"
  | "system";

export type KnowledgeRelationType =
  | "depends_on"
  | "influences"
  | "belongs_to"
  | "supports"
  | "conflicts_with"
  | "improves"
  | "creates_risk"
  | "reduces_risk"
  | "requires"
  | "measures";

export type KnowledgeConfidenceLevel = "low" | "medium" | "high";

export type KnowledgeNode = {
  id: string;
  type: KnowledgeNodeType;
  title: string;
  description?: string;
  confidence: KnowledgeConfidenceLevel;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type KnowledgeRelation = {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  type: KnowledgeRelationType;
  confidence: KnowledgeConfidenceLevel;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

export type CorporateKnowledgeGraph = {
  nodes: KnowledgeNode[];
  relations: KnowledgeRelation[];
  generatedAt: string;
};