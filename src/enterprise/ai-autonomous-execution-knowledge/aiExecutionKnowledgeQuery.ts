import { AIExecutionKnowledgeRepository } from "./aiExecutionKnowledgeRepository";
import { AIExecutionKnowledgeRecord } from "./aiExecutionKnowledgeRecord";
import {
  AIExecutionKnowledgeScope,
  AIExecutionKnowledgeStatus,
  AIExecutionKnowledgeType,
} from "./aiAutonomousExecutionKnowledgeTypes";

export interface AIExecutionKnowledgeQuery {
  type?: AIExecutionKnowledgeType;
  scope?: AIExecutionKnowledgeScope;
  status?: AIExecutionKnowledgeStatus;
  tag?: string;
  minimumConfidence?: number;
}

export function queryAIExecutionKnowledge(
  repository: AIExecutionKnowledgeRepository,
  query: AIExecutionKnowledgeQuery,
): AIExecutionKnowledgeRecord[] {
  return repository.list().filter((record) => {
    if (query.type && record.type !== query.type) {
      return false;
    }

    if (query.scope && record.scope !== query.scope) {
      return false;
    }

    if (query.status && record.status !== query.status) {
      return false;
    }

    if (query.tag && !record.tags.includes(query.tag)) {
      return false;
    }

    if (
      query.minimumConfidence !== undefined &&
      record.metrics.confidence < query.minimumConfidence
    ) {
      return false;
    }

    return true;
  });
}