import { KnowledgeRetrievalRequest } from "./knowledgeRetrievalRequest";
import { KnowledgeRetrievalResult } from "./knowledgeRetrievalResult";

export interface KnowledgeRetrievalEngine {
  retrieve(
    request: KnowledgeRetrievalRequest,
  ): Promise<KnowledgeRetrievalResult>;
}