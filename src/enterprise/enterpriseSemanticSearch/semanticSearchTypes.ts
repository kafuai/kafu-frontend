export type SemanticSearchMode =
  | "keyword"
  | "semantic"
  | "hybrid"
  | "contextual";

export type SemanticSearchScope =
  | "organization"
  | "department"
  | "policy"
  | "document"
  | "employee"
  | "knowledge_graph";

export type SemanticSearchConfidence =
  | "low"
  | "medium"
  | "high"
  | "verified";

export interface SemanticSearchContext {
  readonly tenantId: string;
  readonly requesterId: string;
  readonly scope: SemanticSearchScope;
  readonly mode: SemanticSearchMode;
  readonly timestamp: string;
}