import { KnowledgeGraphNode } from "./knowledgeGraphNode";
import { KnowledgeGraphRelation } from "./knowledgeGraphRelation";
import {
  KnowledgeGraphInsight,
  createKnowledgeGraphInsight,
} from "./knowledgeGraphInsight";

export function analyzeKnowledgeGraph(
  nodes: readonly KnowledgeGraphNode[],
  relations: readonly KnowledgeGraphRelation[],
): readonly KnowledgeGraphInsight[] {
  const insights: KnowledgeGraphInsight[] = [];

  for (const node of nodes) {
    const degree = relations.filter(
      (r) => r.fromNodeId === node.id || r.toNodeId === node.id,
    ).length;

    if (degree === 0) {
      insights.push(
        createKnowledgeGraphInsight({
          id: `isolated-${node.id}`,
          type: "missing_connection",
          title: "Isolated Knowledge Node",
          description: `${node.name} has no graph connections.`,
          relatedNodeIds: [node.id],
          relatedRelationIds: [],
          severity: "medium",
          createdAt: new Date().toISOString(),
        }),
      );
    }
  }

  return insights;
}