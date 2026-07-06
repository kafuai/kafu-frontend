import { KnowledgeGraphNode } from "./knowledgeGraphNode";
import { KnowledgeGraphRelation } from "./knowledgeGraphRelation";

export interface KnowledgeGraphQueryResult {
  readonly nodes: readonly KnowledgeGraphNode[];
  readonly relations: readonly KnowledgeGraphRelation[];
}

export function queryConnectedNodes(
  nodeId: string,
  nodes: readonly KnowledgeGraphNode[],
  relations: readonly KnowledgeGraphRelation[],
): KnowledgeGraphQueryResult {
  const connected = relations.filter(
    (r) => r.fromNodeId === nodeId || r.toNodeId === nodeId,
  );

  const ids = new Set<string>();

  connected.forEach((r) => {
    ids.add(r.fromNodeId);
    ids.add(r.toNodeId);
  });

  return {
    nodes: nodes.filter((n) => ids.has(n.id)),
    relations: connected,
  };
}