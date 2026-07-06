import { KnowledgeGraphNode } from "./knowledgeGraphNode";
import { KnowledgeGraphRelation } from "./knowledgeGraphRelation";

export interface KnowledgeGraphSnapshot {
  readonly id: string;
  readonly createdAt: string;
  readonly nodeCount: number;
  readonly relationCount: number;
  readonly nodes: readonly KnowledgeGraphNode[];
  readonly relations: readonly KnowledgeGraphRelation[];
}

export function createKnowledgeGraphSnapshot(
  id: string,
  nodes: readonly KnowledgeGraphNode[],
  relations: readonly KnowledgeGraphRelation[],
): KnowledgeGraphSnapshot {
  return {
    id,
    createdAt: new Date().toISOString(),
    nodeCount: nodes.length,
    relationCount: relations.length,
    nodes: [...nodes],
    relations: [...relations],
  };
}