import { KnowledgeRetrievalRegistry } from "./knowledgeRetrievalRegistry";
import { KnowledgeRetrievalService } from "./knowledgeRetrievalService";

export class KnowledgeRetrievalFactory {
  static create(): KnowledgeRetrievalService {
    return new KnowledgeRetrievalService(
      new KnowledgeRetrievalRegistry(),
    );
  }
}