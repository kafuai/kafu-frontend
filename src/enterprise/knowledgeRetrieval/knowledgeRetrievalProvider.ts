import { KnowledgeRetrievalRequest } from "./knowledgeRetrievalRequest";
import { RetrievedKnowledgeItem } from "./knowledgeRetrievalResult";

export interface KnowledgeRetrievalProvider {
  readonly id: string;

  readonly name: string;

  canHandle(request: KnowledgeRetrievalRequest): boolean;

  retrieve(
    request: KnowledgeRetrievalRequest,
  ): Promise<readonly RetrievedKnowledgeItem[]>;
}