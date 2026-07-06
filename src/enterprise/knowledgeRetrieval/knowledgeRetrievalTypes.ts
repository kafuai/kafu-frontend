export type RetrievalMode =
  | "semantic"
  | "keyword"
  | "hybrid"
  | "graph"
  | "reasoning";

export type RetrievalScope =
  | "organization"
  | "department"
  | "team"
  | "knowledgeBase"
  | "document"
  | "global";

export type RetrievalStrategy =
  | "fastest"
  | "balanced"
  | "highest_relevance"
  | "highest_confidence";

export type RetrievalStatus =
  | "pending"
  | "running"
  | "completed"
  | "partial"
  | "failed";

export interface RetrievalFilters {
  readonly departmentIds?: readonly string[];
  readonly documentIds?: readonly string[];
  readonly tags?: readonly string[];
  readonly owners?: readonly string[];
  readonly languages?: readonly string[];
  readonly sensitivityLevels?: readonly string[];
}

export interface RetrievalRanking {
  readonly strategy: RetrievalStrategy;
  readonly minimumScore: number;
  readonly maximumResults: number;
}