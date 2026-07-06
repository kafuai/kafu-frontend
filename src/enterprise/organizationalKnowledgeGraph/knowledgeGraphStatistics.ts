import { KnowledgeGraphNode } from "./knowledgeGraphNode";
import { KnowledgeGraphRelation } from "./knowledgeGraphRelation";

export interface KnowledgeGraphStatistics {
  readonly totalNodes: number;
  readonly totalRelations: number;
  readonly averageConnectionsPerNode: number;
}

export function calculateKnowledgeGraphStatistics(
  nodes: readonly KnowledgeGraphNode[],
  relations: readonly KnowledgeGraphRelation[],
): KnowledgeGraphStatistics {
  return {
    totalNodes: nodes.length,
    totalRelations: relations.length,
    averageConnectionsPerNode:
      nodes.length === 0 ? 0 : relations.length / nodes.length,
  };
}