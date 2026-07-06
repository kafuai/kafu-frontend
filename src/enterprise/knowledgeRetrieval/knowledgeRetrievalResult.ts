import { RetrievalStatus } from "./knowledgeRetrievalTypes";

export interface RetrievedKnowledgeItem {
  readonly knowledgeId: string;
  readonly title: string;
  readonly summary: string;

  readonly sourceId: string;
  readonly sourceType: string;

  readonly relevanceScore: number;
  readonly confidenceScore: number;

  readonly matchedBy: readonly string[];

  readonly graphDistance?: number;
}

export interface KnowledgeRetrievalResult {
  readonly requestId: string;

  readonly status: RetrievalStatus;

  readonly totalMatches: number;

  readonly processingTimeMs: number;

  readonly results: readonly RetrievedKnowledgeItem[];

  readonly generatedAt: string;
}