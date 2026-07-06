import {
  RetrievalFilters,
  RetrievalMode,
  RetrievalRanking,
  RetrievalScope,
} from "./knowledgeRetrievalTypes";

export interface KnowledgeRetrievalRequest {
  readonly requestId: string;
  readonly tenantId: string;
  readonly requesterId: string;

  readonly query: string;

  readonly mode: RetrievalMode;
  readonly scope: RetrievalScope;

  readonly filters?: RetrievalFilters;

  readonly ranking: RetrievalRanking;

  readonly includeReasoning: boolean;
  readonly includeGraphContext: boolean;
  readonly includeSemanticMatches: boolean;

  readonly requestedAt: string;
}